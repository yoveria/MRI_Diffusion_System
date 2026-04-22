import { Activity, BrainCircuit, Download, Layers3, ShieldCheck } from "lucide-react";
import compareFigure from "../figure/compare.png";
import t1Figure from "../figure/T1.png";
import t2Figure from "../figure/T2.png";
import { featureHighlights, featureItems } from "../constants/site";
import { Reveal } from "./Reveal";

const featureIcons = [Layers3, BrainCircuit, ShieldCheck, Activity, Download];

export const Features = () => {
  return (
    <section id="features" className="scroll-mt-28 space-y-8" aria-labelledby="features-heading">
      <Reveal className="space-y-3" delay={0.03}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">Product Functions</p>
        <h2 id="features-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          产品功能
        </h2>
        <p className="max-w-3xl text-[16px] leading-[1.82] text-muted">
          直接执行关键动作，持续获得状态反馈，用更短路径完成可用结果。
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {featureItems.map((item, index) => {
            const Icon = featureIcons[index % featureIcons.length];

            return (
              <article
                key={item.title}
                className="group h-full rounded-card border border-border bg-surface p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-primary/20 bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <h3 className="text-[18px] font-semibold leading-[1.35] text-text">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-muted">{item.description}</p>
                <p className="mt-4 font-mono text-[12px] tracking-wide text-secondary">{item.metric}</p>
              </article>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="highlight-heading">
          <h3 id="highlight-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            功能亮点展示
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
            功能细节界面
          </h3>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr_1fr]">
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">输入工作台</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={t1Figure} alt="输入工作台示意" className="mx-auto h-auto max-h-[220px] w-auto max-w-full object-contain" />
              </div>
              <div className="mt-3 grid gap-2 text-[12px] text-muted">
                <div className="rounded-[8px] border border-border bg-surface px-2.5 py-1.5">上传后立即预览</div>
                <div className="rounded-[8px] border border-border bg-surface px-2.5 py-1.5">检查输入质量并继续</div>
              </div>
            </article>
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">控制与反馈</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">点击开始生成，立即进入处理状态</div>
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">处理中可取消，减少等待成本</div>
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">状态提示持续更新，降低不确定感</div>
                <div className="rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-muted">成功后直接对比并下载</div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-border/60">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
            </article>
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">结果与对比</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={t2Figure} alt="结果图工作台示意" className="mx-auto h-auto max-h-[200px] w-auto max-w-full object-contain" />
              </div>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={compareFigure} alt="对比查看操作示意" className="mx-auto h-auto max-h-[200px] w-auto max-w-full object-contain" />
              </div>
              <div className="mt-3 rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted">
                观察结构与灰度差异后，一键完成导出。
              </div>
            </article>
          </div>
        </section>
      </Reveal>
    </section>
  );
};

