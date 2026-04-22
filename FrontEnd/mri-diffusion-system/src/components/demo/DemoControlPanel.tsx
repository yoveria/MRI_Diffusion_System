import { Loader2, PlayCircle, RotateCcw, Square } from "lucide-react";
import type { DemoStatus } from "../../types/demo";

type DemoControlPanelProps = {
  status: DemoStatus;
  progress: number;
  canStart: boolean;
  canCancel: boolean;
  onStart: () => void;
  onCancel: () => void;
  onReset: () => void;
  zoom: number;
  onZoomChange: (nextZoom: number) => void;
};

export const DemoControlPanel = ({
  status,
  progress,
  canStart,
  canCancel,
  onStart,
  onCancel,
  onReset,
  zoom,
  onZoomChange,
}: DemoControlPanelProps) => {
  return (
    <section className="space-y-4 rounded-[14px] border border-border bg-bg p-4" aria-label="控制区">
      <div className="space-y-2">
        <label className="text-[12px] font-medium text-secondary" htmlFor="target-modality">
          目标任务
        </label>
        <select
          id="target-modality"
          className="w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-text"
          defaultValue="t2"
        >
          <option value="t2">生成 T2 模态</option>
          <option value="flair">生成 FLAIR 模态（预留）</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="zoom-range" className="text-[12px] font-medium text-secondary">
          联动缩放（预览/结果/对比）
        </label>
        <div className="flex items-center gap-2">
          <input
            id="zoom-range"
            type="range"
            min="0.8"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-full accent-primary"
          />
          <span className="font-mono text-[12px] text-secondary">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-surface transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "uploading" || status === "processing" ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={14} />}
          开始生成
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={!canCancel}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Square size={14} />
          取消
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={status === "uploading" || status === "processing"}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={14} />
          重置
        </button>
      </div>

      <p className="text-[12px] leading-6 text-muted">当前进度：{Math.round(progress)}%</p>
    </section>
  );
};
