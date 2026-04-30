import type { SectionId } from "../constants/site";

type FooterCTAProps = {
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onNavClick: (id: SectionId) => void;
};

export const FooterCTA = ({ onPrimaryAction, onSecondaryAction, onNavClick }: FooterCTAProps) => {
  return (
    <footer className="mt-16 border-t border-border/80 bg-surface/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-soft md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-2xl text-text">开始体验AI模态补全</p>
            <p className="max-w-2xl text-sm leading-7 text-muted">上传单模态脑MRI图像，查看目标模态生成与多模态对照效果。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              立即体验
            </button>
            <button
              type="button"
              onClick={onSecondaryAction}
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-text transition duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              生成效果
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 text-sm text-muted md:flex-row md:items-center">
          <nav className="flex flex-wrap items-center gap-2" aria-label="页脚导航">
            <button
              type="button"
              onClick={() => onNavClick("home")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              首页
            </button>
            <button
              type="button"
              onClick={() => onNavClick("capabilities")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              产品能力
            </button>
            <button
              type="button"
              onClick={() => onNavClick("reliability")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              可靠性验证
            </button>
            <button
              type="button"
              onClick={() => onNavClick("scenarios")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              应用场景
            </button>
            <button
              type="button"
              onClick={() => onNavClick("demo")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              在线体验
            </button>
          </nav>
          <div className="space-y-1">
            <p className="text-text">MRI Diffusion System</p>
            <p>面向脑肿瘤MRI模态缺失场景的AI生成补全与辅助判读工具。</p>
            <p>© 2026 MRI Diffusion System. For research and demonstration use.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
