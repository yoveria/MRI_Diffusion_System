import { BrainCircuit, Download, ScanSearch, UploadCloud } from "lucide-react";
import compareFigure from "../figure/compare.png";
import t1Figure from "../figure/T1.png";
import t2Figure from "../figure/T2.png";
import { capabilitiesSubtitle, capabilityItems, featureHighlights } from "../constants/site";
import { Reveal } from "./Reveal";

const capabilityIcons = [UploadCloud, BrainCircuit, ScanSearch, Download];

export const Features = () => {
  return (
    <section id="capabilities" className="scroll-mt-28 space-y-8" aria-labelledby="capabilities-heading">
      <Reveal className="space-y-3" delay={0.03}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">Product Capabilities</p>
        <h2 id="capabilities-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          产品能力
        </h2>
        <p className="max-w-3xl text-[16px] leading-[1.82] text-muted">{capabilitiesSubtitle}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilityItems.map((item, index) => {
            const Icon = capabilityIcons[index % capabilityIcons.length];

            return (
              <article
                key={item.title}
                className="group h-full rounded-card border border-border bg-surface p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-primary/20 bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <p className="font-mono text-[12px] tracking-[0.1em] text-secondary">{item.tag}</p>
                <h3 className="mt-2 text-[20px] font-semibold leading-[1.35] text-text">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="highlight-heading">
          <h3 id="highlight-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            能力亮点
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {featureHighlights.map((highlight) => (
              <article key={highlight.title} className="rounded-[14px] border border-border bg-bg p-4">
                <h4 className="text-[17px] font-semibold text-text">{highlight.title}</h4>
                <p className="mt-2 text-[14px] leading-7 text-muted">{highlight.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="mockup-heading">
          <h3 id="mockup-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            能力界面示意
          </h3>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr_1fr]">
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">源模态输入</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={t1Figure} alt="源模态输入示意" className="mx-auto h-auto max-h-[220px] w-auto max-w-full object-contain" />
              </div>
              <div className="mt-3 rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted">上传并确认 T1 输入图像。</div>
            </article>
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">目标模态生成</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">扩散模型执行目标模态生成</div>
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">持续反馈上传、推理和结果状态</div>
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">可中断、可重置、可重复验证</div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-border/60">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
            </article>
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">多模态对照与导出</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={t2Figure} alt="目标模态生成示意" className="mx-auto h-auto max-h-[200px] w-auto max-w-full object-contain" />
              </div>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={compareFigure} alt="多模态滑块对比示意" className="mx-auto h-auto max-h-[200px] w-auto max-w-full object-contain" />
              </div>
              <div className="mt-3 rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted">
                支持并排、缩放与滑块对比，并可下载结果。
              </div>
            </article>
          </div>
        </section>
      </Reveal>
    </section>
  );
};
