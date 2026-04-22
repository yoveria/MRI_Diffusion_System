import type { SectionId } from "../constants/site";

type FooterCTAProps = {
  onPrimaryAction: () => void;
  onNavClick: (id: SectionId) => void;
};

export const FooterCTA = ({ onPrimaryAction, onNavClick }: FooterCTAProps) => {
  return (
    <footer className="mt-16 border-t border-border/80 bg-surface/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-soft md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-2xl text-text">MRI Diffusion System</p>
            <p className="max-w-2xl text-sm leading-7 text-muted">
              面向医疗影像 AI 的用户使用型平台，强调流程可执行、结果可验证、任务可闭环。
            </p>
          </div>
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            立即体验
          </button>
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
              onClick={() => onNavClick("features")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              产品功能
            </button>
            <button
              type="button"
              onClick={() => onNavClick("guide")}
              className="rounded-full border border-border bg-surface px-4 py-2 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              使用说明
            </button>
          </nav>
          <p>© 2026 MRI Diffusion System。保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

