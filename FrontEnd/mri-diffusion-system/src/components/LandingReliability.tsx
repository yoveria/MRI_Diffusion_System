import bratsDatasetFigure from "../figure/BraTS2021.png";
import ixiDatasetFigure from "../figure/IXI.png";
import visualCompareFigure from "../figure/可视化结果对比.png";
import { Reveal } from "./Reveal";

const reliabilitySubtitle = "通过公开脱敏数据、生成质量指标、可视化对比和系统运行结果，多维度呈现产品可靠性。";

const reliabilityDatasets = [
  {
    title: "BraTS2021",
    tag: "脑肿瘤MRI数据",
    dataType: "公开脱敏多模态脑MRI",
    modalities: "T1 / T2 / FLAIR / T1ce",
    purpose: "复杂病灶场景验证",
    image: bratsDatasetFigure,
  },
  {
    title: "IXI",
    tag: "健康脑MRI数据",
    dataType: "公开脱敏多模态脑MRI",
    modalities: "T1 / T2 / PD",
    purpose: "规则脑结构场景补充验证",
    image: ixiDatasetFigure,
  },
];

const reliabilityMetrics = [
  {
    metric: "PSNR",
    value: "27.58 dB",
    source: "BraTS2021 T1→T2",
    description: "衡量像素层面的重建接近程度，数值越高表示误差越小。",
  },
  {
    metric: "SSIM",
    value: "92.99%",
    source: "BraTS2021 T1→T2",
    description: "衡量结构相似性，数值越高表示结构保持越好。",
  },
  {
    metric: "PSNR",
    value: "31.63 dB",
    source: "IXI T2→T1",
    description: "规则脑结构场景下的生成表现参考。",
  },
  {
    metric: "SSIM",
    value: "95.64%",
    source: "IXI T2→T1",
    description: "规则脑结构场景下的结构相似性参考。",
  },
];

const reliabilityRuntime = [
  {
    metric: "功能通过率",
    value: "100%",
    description: "上传、生成、对比、下载流程测试通过",
  },
  {
    metric: "生成成功率",
    value: "待统计",
    description: "建议接入多次请求统计，不伪造结果",
  },
  {
    metric: "平均推理耗时",
    value: "待统计",
    description: "建议统计模型推理与端到端返回耗时",
  },
  {
    metric: "接口状态",
    value: "服务正常",
    description: "健康检查接口可返回模型加载与设备信息",
  },
];

const reliabilityHealthLines = [
  "服务状态：正常",
  "模型状态：已加载",
  "运行设备：GPU / CPU 自动识别",
  "接口状态：可访问",
];

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

                <div className="mt-3 aspect-[15/4] overflow-hidden rounded-[10px] border border-border bg-surface">
                  <img src={dataset.image} alt={`${dataset.title}数据集示意图`} className="h-full w-full object-contain object-center" />
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
          <p className="text-[14px] leading-7 text-muted">通过PSNR、SSIM等指标评价生成图像与真实目标模态之间的接近程度。</p>
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
            通过源模态、AI生成目标模态和真实目标模态的对比展示，直观观察模态补全效果。
          </p>

          <div className="aspect-[16/9] overflow-hidden rounded-[14px] border border-border bg-bg">
            <img src={visualCompareFigure} alt="可视化结果对比" className="h-full w-full object-contain object-center" />
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
          <p className="text-[14px] leading-7 text-muted">通过功能测试与接口状态展示系统的可运行性和工程完整度。</p>
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
