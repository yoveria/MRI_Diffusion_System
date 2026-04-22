import { CircleHelp, FileCheck2, PlayCircle, Settings2, UploadCloud } from "lucide-react";
import { faqItems, guideSteps, guideTips } from "../constants/site";
import { Reveal } from "./Reveal";

const stepIcons = [UploadCloud, Settings2, PlayCircle, FileCheck2, FileCheck2];

type GuideProps = {
  onPrimaryAction: () => void;
};

export const Guide = ({ onPrimaryAction }: GuideProps) => {
  return (
    <section id="guide" className="scroll-mt-28 space-y-8" aria-labelledby="guide-heading">
      <Reveal className="space-y-3" delay={0.03}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">User Guide</p>
        <h2 id="guide-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          使用说明
        </h2>
        <p className="max-w-3xl text-[16px] leading-[1.82] text-muted">
          无需复杂准备，按照页面提示即可快速完成上传、生成与导出。
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="steps-heading">
          <h3 id="steps-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            五步使用流程
          </h3>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {guideSteps.map((step, index) => {
              const Icon = stepIcons[index % stepIcons.length];

              return (
                <li key={step.title} className="list-none rounded-[14px] border border-border bg-bg p-4">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] border border-secondary/20 bg-secondary/10 text-secondary">
                    <Icon size={16} />
                  </div>
                  <h4 className="mt-3 text-[17px] font-semibold leading-[1.35] text-text">{step.title}</h4>
                  <p className="mt-2 text-[14px] leading-7 text-muted">{step.description}</p>
                  <p className="mt-3 rounded-[10px] border border-border bg-surface px-2.5 py-2 font-mono text-[12px] text-secondary">
                    {step.statusHint}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal delay={0.1}>
          <section className="h-full rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="tips-heading">
            <h3 id="tips-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
              使用提示
            </h3>
            <ul className="mt-4 space-y-3 pl-5 text-[14px] leading-7 text-muted">
              {guideTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.12}>
          <section className="h-full rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="faq-heading">
            <h3 id="faq-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
              FAQ
            </h3>
            <div className="mt-4 space-y-3">
              {faqItems.map((faq) => (
                <article key={faq.question} className="rounded-[14px] border border-border bg-bg p-4">
                  <h4 className="flex items-start gap-2 text-[15px] font-semibold leading-6 text-text">
                    <CircleHelp size={16} className="mt-1 shrink-0 text-secondary" />
                    {faq.question}
                  </h4>
                  <p className="mt-2 text-[14px] leading-7 text-muted">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-soft md:flex-row md:items-center md:justify-between" aria-label="页面底部 CTA">
          <div className="space-y-2">
            <h3 className="font-serif text-[30px] font-semibold leading-[1.3] text-text">准备开始一次完整体验？</h3>
            <p className="text-[15px] leading-7 text-muted">上传图像后即可进入生成流程，快速查看结果并完成导出。</p>
          </div>
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-surface shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            立即体验
          </button>
        </section>
      </Reveal>
    </section>
  );
};
