import compareFigure from "../figure/compare.png";
import t1Figure from "../figure/T1.png";
import t2Figure from "../figure/T2.png";
import {
  reliabilityDatasets,
  reliabilityHealthLines,
  reliabilityMetrics,
  reliabilityRuntime,
  reliabilitySubtitle,
} from "../constants/site";
import { Reveal } from "./Reveal";

export const Reliability = () => {
  return (
    <section id="reliability" className="scroll-mt-28 space-y-8" aria-labelledby="reliability-heading">
      <Reveal className="space-y-3" delay={0.03}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">Reliability Validation</p>
        <h2 id="reliability-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          可靠性验证
        </h2>
        <p className="max-w-4xl text-[16px] leading-[1.82] text-muted">{reliabilitySubtitle}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="data-foundation-heading">
          <h3 id="data-foundation-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            公开脱敏数据基础
          </h3>
          <p className="text-[14px] leading-7 text-muted">
            系统基于公开脱敏脑MRI数据进行训练、测试与生成质量评估，覆盖复杂病灶和规则结构两类场景。
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {reliabilityDatasets.map((dataset) => (
              <article key={dataset.title} className="rounded-[14px] border border-border bg-bg p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-[20px] font-semibold text-text">{dataset.title}</h4>
                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-secondary">{dataset.tag}</span>
                </div>
                <div className="mt-3 space-y-2 text-[14px] leading-7 text-muted">
                  <p>数据类型：{dataset.dataType}</p>
                  <p>常用模态：{dataset.modalities}</p>
                  <p>使用目的：{dataset.purpose}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="metric-heading">
          <h3 id="metric-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            生成质量指标
          </h3>
          <p className="text-[14px] leading-7 text-muted">
            通过PSNR、SSIM等指标评价生成图像与真实目标模态之间的接近程度。
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reliabilityMetrics.map((metric, index) => (
              <article key={`${metric.metric}-${metric.source}-${index}`} className="rounded-[14px] border border-border bg-bg p-4">
                <p className="font-mono text-[12px] tracking-[0.08em] text-secondary">{metric.metric}</p>
                <p className="mt-2 text-[28px] font-semibold leading-[1.15] text-text">{metric.value}</p>
                <p className="mt-2 text-[12px] text-secondary">{metric.source}</p>
                <p className="mt-3 text-[13px] leading-6 text-muted">{metric.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="compare-heading">
          <h3 id="compare-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            可视化结果对比
          </h3>
          <p className="text-[14px] leading-7 text-muted">
            通过源模态、AI生成目标模态和真实目标模态的并列展示，直观观察模态补全效果。
          </p>
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium text-secondary">源模态输入</p>
              <p className="mt-1 text-[12px] text-muted">T1 MRI</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={t1Figure} alt="源模态输入 T1 MRI" className="mx-auto h-auto max-h-[210px] w-auto max-w-full object-contain" />
              </div>
            </article>
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium text-secondary">AI生成目标模态</p>
              <p className="mt-1 text-[12px] text-muted">生成T2</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={compareFigure} alt="AI生成目标模态 生成T2" className="mx-auto h-auto max-h-[210px] w-auto max-w-full object-contain" />
              </div>
            </article>
            <article className="rounded-[14px] border border-border bg-bg p-4">
              <p className="text-[13px] font-medium text-secondary">真实目标模态</p>
              <p className="mt-1 text-[12px] text-muted">真实T2参考</p>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-bg p-2">
                <img src={t2Figure} alt="真实目标模态 真实T2参考" className="mx-auto h-auto max-h-[210px] w-auto max-w-full object-contain" />
              </div>
            </article>
          </div>
          <p className="rounded-[12px] border border-border bg-bg px-4 py-3 text-[13px] leading-6 text-muted">
            用于观察脑室结构、灰白质边界、病灶相关区域和灰度过渡情况。结构越稳定，对多序列对照观察越有参考价值。
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.18}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="runtime-heading">
          <h3 id="runtime-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            系统运行状态
          </h3>
          <p className="text-[14px] leading-7 text-muted">
            通过功能测试与接口状态展示系统的可运行性和工程完整度。
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reliabilityRuntime.map((runtime) => (
              <article key={runtime.metric} className="rounded-[14px] border border-border bg-bg p-4">
                <p className="text-[13px] font-medium text-secondary">{runtime.metric}</p>
                <p className="mt-2 text-[26px] font-semibold leading-[1.2] text-text">{runtime.value}</p>
                <p className="mt-2 text-[13px] leading-6 text-muted">{runtime.description}</p>
              </article>
            ))}
          </div>
          <div className="rounded-[14px] border border-border bg-bg p-4">
            <p className="text-[13px] font-semibold text-text">健康检查状态</p>
            <div className="mt-2 grid gap-2 text-[13px] leading-6 text-muted md:grid-cols-2">
              {reliabilityHealthLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </section>
  );
};
