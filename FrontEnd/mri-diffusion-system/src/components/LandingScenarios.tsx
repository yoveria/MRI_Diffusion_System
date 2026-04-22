import { ArrowRightCircle } from "lucide-react";
import preprocessImage from "../figure/分割.png";
import researchImage from "../figure/科研.jpg";
import teachingImage from "../figure/教学.jpg";
import { scenarioItems, scenarioPathItems } from "../constants/site";
import { Reveal } from "./Reveal";

const scenarioImages = [teachingImage, researchImage, preprocessImage];

export const Scenarios = () => {
  return (
    <section id="scenarios" className="scroll-mt-28 space-y-8" aria-labelledby="scenarios-heading">
      <Reveal className="space-y-3" delay={0.03}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">Application Scenarios</p>
        <h2 id="scenarios-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          应用场景
        </h2>
        <p className="max-w-4xl text-[16px] leading-[1.82] text-muted">
          围绕脑 MRI 模态缺失问题，面向教学展示、科研验证与智能影像处理辅助等多类使用需求，提供更直观、更完整的生成体验。
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="grid gap-4 lg:grid-cols-3">
          {scenarioItems.map((scenario, index) => (
            <article key={scenario.title} className="h-full rounded-card border border-border bg-surface p-6 shadow-soft">
              <p className="text-[12px] font-medium tracking-[0.01em] text-secondary">{scenario.sceneLabel}</p>

              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img
                  src={scenarioImages[index]}
                  alt={`${scenario.title}场景示意图`}
                  className="mx-auto h-auto max-h-[220px] w-auto max-w-full object-contain"
                />
              </div>

              <h3 className="mt-4 text-[24px] font-semibold leading-[1.35] text-text">{scenario.title}</h3>
              <p className="mt-3 rounded-[14px] border border-border bg-bg px-4 py-3 text-[14px] leading-7 text-muted">
                {scenario.description}
              </p>
              <div className="mt-4 rounded-[14px] border border-border bg-bg px-4 py-3">
                <p className="text-[13px] font-medium text-secondary">适用人群</p>
                <p className="mt-1 text-[14px] leading-7 text-muted">{scenario.audience}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="path-heading">
          <h3 id="path-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            你可以这样使用它
          </h3>

          <div className="grid gap-3">
            {scenarioPathItems.map((path, index) => (
              <article key={path.title} className="rounded-[14px] border border-border bg-bg px-4 py-3">
                <p className="text-[15px] font-semibold text-text">路径 {index + 1}</p>
                <p className="mt-1 text-[14px] font-medium text-secondary">{path.title}</p>
                <p className="mt-1 text-[14px] leading-7 text-muted">{path.flow}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="rounded-card border border-border bg-surface p-5 shadow-soft" aria-label="场景总结区">
          <h3 className="font-serif text-[28px] font-semibold leading-[1.3] text-text">让生成能力真正进入使用场景。</h3>
          <p className="mt-2 flex items-center gap-2 text-[15px] leading-7 text-muted">
            <ArrowRightCircle size={18} className="shrink-0 text-accent" />
            从教学到科研再到流程辅助，你都可以直接把生成能力接入真实任务中。
          </p>
        </section>
      </Reveal>
    </section>
  );
};
