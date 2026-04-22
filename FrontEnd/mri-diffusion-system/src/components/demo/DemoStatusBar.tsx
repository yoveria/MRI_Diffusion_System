import type { DemoStatus } from "../../types/demo";

type DemoStatusBarProps = {
  status: DemoStatus;
  progress: number;
  message: string;
};

const statusLabelMap: Record<DemoStatus, string> = {
  idle: "空闲",
  uploading: "上传中",
  processing: "处理中",
  success: "成功",
  error: "失败",
};

const statusClassMap: Record<DemoStatus, string> = {
  idle: "border-border bg-surface text-muted",
  uploading: "border-primary/30 bg-primary/10 text-primary",
  processing: "border-secondary/30 bg-secondary/10 text-secondary",
  success: "border-accent/30 bg-accent/10 text-accent",
  error: "border-rose-300 bg-rose-50 text-rose-600",
};

export const DemoStatusBar = ({ status, progress, message }: DemoStatusBarProps) => {
  return (
    <section className="space-y-3 rounded-[14px] border border-border bg-bg p-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${statusClassMap[status]}`}>
          状态：{statusLabelMap[status]}
        </span>
        <span className="font-mono text-[12px] text-secondary">进度 {Math.round(progress)}%</span>
      </div>
      <p className="text-[13px] leading-6 text-muted">{message}</p>
      <div className="h-2 overflow-hidden rounded-full bg-border/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
        />
      </div>
    </section>
  );
};
