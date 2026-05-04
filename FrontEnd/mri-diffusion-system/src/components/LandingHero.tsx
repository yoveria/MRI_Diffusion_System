import { ArrowRight, CheckCircle2, PlayCircle, UploadCloud, Workflow } from "lucide-react";
import t1Figure from "../figure/T1.png";
import t2Figure from "../figure/T2.png";
import { flowSteps, heroBadge, heroSubtitle, heroTitle, valueCards } from "../constants/site";
import { Reveal } from "./Reveal";

type HeroProps = {
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

const heroBottomChips = ["单模态输入", "目标模态生成", "多序列对照观察"];

export const Hero = ({ onPrimaryAction, onSecondaryAction }: HeroProps) => {
  return (
    <section id="home" className="scroll-mt-28 space-y-8" aria-labelledby="hero-heading">
      <div className="relative overflow-hidden rounded-[20px] border border-border bg-surface/70">
        <div className="pointer-events-none absolute inset-0 z-0 bg-imaging-gradient" />
        <div className="pointer-events-none absolute inset-0 z-0 diffusion-wave opacity-45" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-surface/15 via-bg/55 to-bg/80" />

        <div className="relative z-20 grid min-h-[82vh] items-center gap-8 px-6 py-12 md:px-10 md:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-16">
          <Reveal className="space-y-6" delay={0.02}>
            <span className="inline-flex rounded-full border border-primary/30 bg-surface/85 px-4 py-2 text-[13px] font-semibold tracking-wide text-primary">
              {heroBadge}
            </span>

            <div className="space-y-4">
              <h1 id="hero-heading" className="font-serif text-[42px] font-bold leading-[1.18] tracking-[-0.01em] text-text md:text-[54px]">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-[17px] font-medium leading-[1.85] text-muted">{heroSubtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-surface shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                立即体验
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={onSecondaryAction}
                className="rounded-full border border-border bg-surface px-6 py-3 text-[15px] font-semibold text-text transition duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                生成效果
              </button>
            </div>

            <div className="flex flex-wrap gap-3" aria-label="核心价值标签">
              {heroBottomChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-medium text-muted"
                >
                  <CheckCircle2 size={14} className="text-accent" />
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="space-y-4" delay={0.12}>
            <article className="rounded-card border border-border bg-surface/95 p-4 shadow-soft lg:p-5" aria-label="输入输出示意">
              <div className="flex items-center justify-between rounded-[12px] border border-border bg-bg px-3 py-2">
                <p className="text-[13px] font-semibold text-text">源模态输入与目标生成</p>
                <span className="font-mono text-[12px] text-secondary">T1 -&gt; 生成T2</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <article className="rounded-[12px] border border-border bg-bg p-2.5">
                  <p className="text-[12px] font-medium text-secondary">源模态输入</p>
                  <p className="mt-1 text-[11px] text-muted">T1 MRI</p>
                  <div className="mx-auto mt-2 aspect-square w-full max-w-[172px] overflow-hidden rounded-[8px] border border-border bg-[#0f172a] p-1.5">
                    <img src={t1Figure} alt="源模态输入 T1 MRI" className="h-full w-full object-contain" />
                  </div>
                  <p className="mt-2 text-[12px] text-muted">上传单模态脑MRI影像</p>
                </article>

                <div className="hidden sm:flex sm:w-[52px] sm:flex-col sm:items-center sm:justify-center sm:gap-1">
                  <ArrowRight size={18} className="text-primary" />
                  <span className="font-mono text-[10px] text-secondary">生成补全</span>
                </div>

                <article className="rounded-[12px] border border-border bg-bg p-2.5">
                  <p className="text-[12px] font-medium text-secondary">生成目标模态</p>
                  <p className="mt-1 text-[11px] text-muted">生成T2</p>
                  <div className="mx-auto mt-2 aspect-square w-full max-w-[172px] overflow-hidden rounded-[8px] border border-border bg-[#0f172a] p-1.5">
                    <img src={t2Figure} alt="AI生成目标模态 生成T2" className="h-full w-full object-contain" />
                  </div>
                  <p className="mt-2 text-[12px] text-muted">补充缺失模态视角</p>
                </article>
              </div>

              <div className="mt-3 rounded-[12px] border border-border bg-bg p-2.5">
                <p className="text-[12px] font-medium text-secondary">关键操作</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted">
                    <UploadCloud size={12} /> 上传图像
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted">
                    <PlayCircle size={12} /> 开始生成
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted">
                    <Workflow size={12} /> 对照观察
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-border/60">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary" />
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.04}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="value-heading">
          <div className="space-y-2">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-secondary">Core Value</p>
            <h2 id="value-heading" className="font-serif text-[34px] font-semibold leading-[1.25] text-text">
              核心价值
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {valueCards.map((item) => (
              <article key={item.title} className="rounded-[14px] border border-border bg-bg p-5">
                <h3 className="text-[20px] font-semibold leading-[1.35] text-text">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-7 text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="flow-heading">
          <div className="space-y-2">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-secondary">Product Flow</p>
            <h2 id="flow-heading" className="font-serif text-[34px] font-semibold leading-[1.25] text-text">
              产品流程
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((step) => (
              <article key={step.title} className="rounded-[14px] border border-border bg-bg p-4">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Workflow size={16} />
                </div>
                <h3 className="mt-3 text-[18px] font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-7 text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>
    </section>
  );
};
