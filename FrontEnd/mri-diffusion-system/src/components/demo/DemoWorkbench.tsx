import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateMriResult } from "../../services/demoApi";
import type { DemoStatus } from "../../types/demo";
import { Reveal } from "../Reveal";
import { DemoComparePane } from "./DemoComparePane";
import { DemoControlPanel } from "./DemoControlPanel";
import { DemoDownloadAction } from "./DemoDownloadAction";
import { DemoImagePane } from "./DemoImagePane";
import { DemoStatusBar } from "./DemoStatusBar";
import { DemoUploader } from "./DemoUploader";

const revokeIfBlobUrl = (url: string | null) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const isAbortError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.name === "AbortError" || error.name === "CanceledError";
};

export const DemoWorkbench = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("等待上传图像并开始任务。");
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const processingTimerRef = useRef<number | null>(null);
  const phaseTimeoutRef = useRef<number | null>(null);
  const statusRef = useRef<DemoStatus>(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const clearTimers = useCallback(() => {
    if (processingTimerRef.current !== null) {
      window.clearInterval(processingTimerRef.current);
      processingTimerRef.current = null;
    }

    if (phaseTimeoutRef.current !== null) {
      window.clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      abortControllerRef.current?.abort();
      revokeIfBlobUrl(sourceUrl);
      revokeIfBlobUrl(resultUrl);
    };
  }, [clearTimers, resultUrl, sourceUrl]);

  const handleFileSelected = useCallback((file: File) => {
    setErrorMessage(null);
    setStatus("idle");
    setProgress(0);
    setStatusMessage("图像已上传，可开始生成。");
    setResultUrl((previous) => {
      revokeIfBlobUrl(previous);
      return null;
    });
    setSourceUrl((previous) => {
      revokeIfBlobUrl(previous);
      return URL.createObjectURL(file);
    });
    setSelectedFile(file);
  }, []);

  const startProcessingTicker = useCallback(() => {
    clearTimers();

    processingTimerRef.current = window.setInterval(() => {
      setProgress((previous) => {
        if (statusRef.current !== "uploading" && statusRef.current !== "processing") {
          return previous;
        }

        if (statusRef.current === "uploading") {
          return Math.min(previous + 1.8, 38);
        }

        if (previous < 75) {
          return Math.min(previous + 0.5, 92);
        }

        return Math.min(previous + 0.15, 95);
      });
    }, 2500);
  }, [clearTimers]);

  const handleStart = useCallback(async () => {
    if (!selectedFile || status === "uploading" || status === "processing") {
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setErrorMessage(null);
    setStatus("uploading");
    setStatusMessage("正在上传图像...");
    setProgress(5);

    let switchedToProcessing = false;

    const moveToProcessing = () => {
      if (switchedToProcessing) {
        return;
      }

      switchedToProcessing = true;
      setStatus("processing");
      setStatusMessage("图像上传完成，后端推理处理中...");
      setProgress((previous) => Math.max(previous, 42));
    };

    startProcessingTicker();
    phaseTimeoutRef.current = window.setTimeout(moveToProcessing, 650);

    try {
      const response = await generateMriResult({
        file: selectedFile,
        signal: controller.signal,
        onUploadProgress: ({ loaded, total }) => {
          if (!total || total <= 0) {
            return;
          }

          const ratio = loaded / total;
          setProgress((previous) => Math.max(previous, Math.min(38, Math.round(ratio * 38))));

          if (ratio >= 0.98) {
            moveToProcessing();
          }
        },
      });

      moveToProcessing();
      setResultUrl((previous) => {
        revokeIfBlobUrl(previous);
        return response.resultUrl;
      });
      setStatus("success");
      setStatusMessage("生成完成，可查看对比并下载结果。");
      setProgress(100);
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) {
        setStatus("idle");
        setStatusMessage("已取消本次生成，可重新开始。");
        setProgress(0);
      } else {
        const nextMessage = error instanceof Error ? error.message : "生成失败，请检查后端服务或稍后重试。";
        setStatus("error");
        setStatusMessage("任务失败，请重试或检查后端连接。");
        setErrorMessage(nextMessage);
        setProgress(0);
      }
    } finally {
      clearTimers();
      abortControllerRef.current = null;
    }
  }, [clearTimers, selectedFile, startProcessingTicker, status]);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleReset = useCallback(() => {
    abortControllerRef.current?.abort();
    clearTimers();
    setResultUrl((previous) => {
      revokeIfBlobUrl(previous);
      return null;
    });
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
    setStatusMessage(selectedFile ? "图像已选择，可重新开始生成。" : "等待上传图像并开始任务。");
  }, [clearTimers, selectedFile]);

  const handleDownload = useCallback(async () => {
    if (!resultUrl) {
      return;
    }

    try {
      if (resultUrl.startsWith("blob:") || resultUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = resultUrl;
        link.download = "generated-mri.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const response = await fetch(resultUrl);
      if (!response.ok) {
        throw new Error("下载失败，后端未返回可用文件。");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "generated-mri.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 120);
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "下载失败，请稍后重试。";
      setStatus("error");
      setStatusMessage("下载失败，请稍后重试。");
      setErrorMessage(nextMessage);
    }
  }, [resultUrl]);

  const canStart = useMemo(
    () => Boolean(selectedFile) && status !== "uploading" && status !== "processing",
    [selectedFile, status],
  );

  const canCancel = status === "uploading" || status === "processing";

  return (
    <section id="demo" className="scroll-mt-28 space-y-6" aria-labelledby="demo-heading">
      <Reveal className="space-y-3" delay={0.02}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">Demo Experience</p>
        <h2 id="demo-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          立即体验
        </h2>
        <p className="max-w-3xl text-[16px] leading-[1.82] text-muted">
          上传图像后即可开始生成，快速查看结果、完成对比并导出。
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="rounded-card border border-border bg-surface p-6 shadow-soft">

          <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
            <div className="space-y-4">
              <DemoUploader file={selectedFile} disabled={status === "uploading" || status === "processing"} onFileSelected={handleFileSelected} />
              <DemoControlPanel
                status={status}
                progress={progress}
                canStart={canStart}
                canCancel={canCancel}
                onStart={handleStart}
                onCancel={handleCancel}
                onReset={handleReset}
                zoom={zoom}
                onZoomChange={setZoom}
              />
              <DemoStatusBar status={status} progress={progress} message={statusMessage} />

              <div className="flex items-center justify-between rounded-[14px] border border-border bg-bg px-4 py-3">
                <p className="text-[12px] text-muted">生成成功后立即启用下载</p>
                <DemoDownloadAction disabled={status !== "success" || !resultUrl} onDownload={handleDownload} />
              </div>

              {errorMessage ? (
                <div className="rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-6 text-rose-700">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-1 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <DemoImagePane
                  title="原图预览区"
                  subtitle="Input"
                  imageUrl={sourceUrl}
                  emptyText="上传后在此预览原图。"
                  zoom={zoom}
                />
                <DemoImagePane
                  title="结果图区"
                  subtitle="Output"
                  imageUrl={resultUrl}
                  emptyText="生成成功后在此显示结果图。"
                  zoom={zoom}
                />
              </div>

              <DemoComparePane sourceUrl={sourceUrl} resultUrl={resultUrl} zoom={zoom} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};


