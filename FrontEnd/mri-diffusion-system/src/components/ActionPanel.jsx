import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

const getStatusFromProgress = (progress) => {
  if (progress < 22) return '\u9884\u5904\u7406\u4e2d';
  if (progress < 78) return '\u63a8\u7406\u8fdb\u884c\u4e2d';
  if (progress < 98) return '\u751f\u6210\u8f93\u51fa\u4e2d';
  return '\u6536\u5c3e\u5904\u7406\u4e2d';
};

export const ActionPanel = ({ onSwitchComparison }) => {
  const {
    isGenerating,
    setGenerating,
    sourceImage,
    sourceImageFile,
    resultImage,
    setResultImage,
  } = useStore();

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('\u7a7a\u95f2');
  const [etaLabel, setEtaLabel] = useState('--s');

  const progressTimerRef = useRef(null);
  const startedAtRef = useRef(0);
  const controllerRef = useRef(null);

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  useEffect(() => () => clearProgressTimer(), []);

  const startSimulatedProgress = () => {
    startedAtRef.current = Date.now();
    setProgress(4);
    setStatusText('\u9884\u5904\u7406\u4e2d');
    setEtaLabel('~15min');

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + (prev < 65 ? 0.5 : prev < 90 ? 0.3 : 0.15), 96);
        setStatusText(getStatusFromProgress(next));

        const elapsed = (Date.now() - startedAtRef.current) / 1000;
        const speed = Math.max(next / Math.max(elapsed, 1), 0.3);
        const remainSeconds = Math.max(Math.ceil((100 - next) / speed), 1);
        setEtaLabel(`${remainSeconds}s`);

        return next;
      });
    }, 5000);
  };

  const resetProgress = () => {
    setTimeout(() => {
      setProgress(0);
      setEtaLabel('--s');
      setStatusText(sourceImage ? '\u5c31\u7eea' : '\u7a7a\u95f2');
    }, 900);
  };

  const cancelInference = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  const startInference = async () => {
    if (!sourceImageFile || isGenerating) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    setGenerating(true);
    startSimulatedProgress();

    let phase = 'error';

    const formData = new FormData();
    formData.append('image', sourceImageFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
        timeout: 900000,
      });

      if (response.data.success) {
        phase = 'success';
        setProgress(100);
        setStatusText('\u5df2\u5b8c\u6210');
        setEtaLabel('0s');
        setResultImage(response.data.result_url);
      } else {
        console.error('Generation failed:', response.data.message);
      }
    } catch (error) {
      if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
        phase = 'cancelled';
        setStatusText('\u5df2\u53d6\u6d88');
        setEtaLabel('--s');
      } else {
        console.error('Backend connection failed:', error);
        alert('\u65e0\u6cd5\u8fde\u63a5\u540e\u7aef\u670d\u52a1\uff0c\u8bf7\u786e\u8ba4 Flask \u5df2\u5728 5000 \u7aef\u53e3\u542f\u52a8\u3002');
      }
    } finally {
      clearProgressTimer();
      controllerRef.current = null;
      setGenerating(false);

      if (phase !== 'success') {
        resetProgress();
      }
    }
  };

  return (
    <div className="action-panel">
      <p className="action-label">{'\u63a8\u7406\u63a7\u5236'}</p>

      <motion.button
        whileHover={!isGenerating && sourceImage ? { scale: 1.03 } : {}}
        whileTap={!isGenerating && sourceImage ? { scale: 0.97 } : {}}
        onClick={startInference}
        disabled={isGenerating || !sourceImage}
        className={`inference-button ${!sourceImage ? 'inference-button-disabled' : ''}`}
        aria-label="start-inference"
      >
        {isGenerating ? (
          <Loader2 className="inference-icon animate-spin" size={20} />
        ) : (
          <ArrowRight className="inference-icon" size={20} />
        )}
      </motion.button>

      <div className="progress-block" role="status" aria-live="polite">
        <div className="progress-meta">
          <span>{isGenerating ? statusText : sourceImage ? '\u5c31\u7eea' : '\u7b49\u5f85\u8f93\u5165'}</span>
          <span>{'\u9884\u8ba1\u5269\u4f59 '} {isGenerating ? etaLabel : '--s'}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="action-copy">
        <p className={`action-state ${isGenerating ? 'action-state-running' : ''}`}>
          {isGenerating
            ? '\u6a21\u578b\u6b63\u5728\u5904\u7406 MRI \u56fe\u50cf'
            : sourceImage
              ? '\u53ef\u5f00\u59cb\u751f\u6210'
              : '\u8bf7\u5148\u4e0a\u4f20\u6e90 MRI \u56fe\u50cf'}
        </p>
        <p className="action-note">{'\u4ece T1 \u751f\u6210 T2'}</p>
      </div>

      {isGenerating ? (
        <button type="button" className="cancel-button" onClick={cancelInference}>
          <X size={14} /> {'\u53d6\u6d88'}
        </button>
      ) : (
        <button
          type="button"
          className="cancel-button cancel-button-ghost"
          onClick={onSwitchComparison}
          disabled={!resultImage}
        >
          {'\u524d\u5f80\u5bf9\u6bd4\u9875'}
        </button>
      )}
    </div>
  );
};
