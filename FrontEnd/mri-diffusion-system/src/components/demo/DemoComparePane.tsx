import { useState } from "react";

type DemoComparePaneProps = {
  sourceUrl: string | null;
  resultUrl: string | null;
  zoom: number;
};

export const DemoComparePane = ({ sourceUrl, resultUrl, zoom }: DemoComparePaneProps) => {
  const [position, setPosition] = useState(50);

  const isReady = Boolean(sourceUrl && resultUrl);

  return (
    <section className="overflow-hidden rounded-[14px] border border-border bg-surface" aria-label="对比区">
      <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-3">
        <h4 className="text-[14px] font-semibold text-text">对比区（滑块对比）</h4>
        <span className="font-mono text-[12px] text-secondary">联动缩放已启用</span>
      </div>

      {isReady ? (
        <div className="p-4">
          <div className="relative h-[300px] overflow-hidden rounded-[10px] border border-border bg-bg">
            <img
              src={sourceUrl ?? ""}
              alt="原图对比"
              className="absolute inset-0 h-full w-full object-contain"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
              <img
                src={resultUrl ?? ""}
                alt="结果图对比"
                className="h-full w-full object-contain"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              />
            </div>
            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
              <div className="h-full w-[2px] bg-primary" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-[12px] text-muted">原图</span>
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-[12px] text-muted">结果</span>
          </div>
        </div>
      ) : (
        <p className="px-4 py-10 text-center text-[13px] leading-6 text-muted">生成成功后可在此进行原图与结果图滑块对比。</p>
      )}
    </section>
  );
};
