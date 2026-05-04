import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Eye,
  Gauge,
  GitCompare,
  Server,
  Target,
  type LucideIcon,
} from "lucide-react";
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

const systemGenerationMetrics = [
  {
    dataset: "BraTS2021",
    task: "T1→T2",
    psnr: 27.58,
    psnrStd: 1.88,
    ssim: 92.99,
    ssimStd: 2.44,
    description: "复杂脑肿瘤场景下的目标模态生成结果。",
  },
  {
    dataset: "BraTS2021",
    task: "T2→T1",
    psnr: 28.37,
    psnrStd: 1.6,
    ssim: 93.66,
    ssimStd: 2.0,
    description: "复杂脑肿瘤场景下的反向模态生成结果。",
  },
  {
    dataset: "IXI",
    task: "T2→T1",
    psnr: 31.63,
    psnrStd: 1.53,
    ssim: 95.64,
    ssimStd: 1.12,
    description: "规则脑结构场景下的生成表现参考。",
  },
];

const methodComparisonMetrics = [
  {
    method: "SelfRDB",
    psnr: 27.42,
    psnrStd: 2.19,
    ssim: 92.95,
    ssimStd: 2.86,
    highlight: true,
  },
  {
    method: "SynDiff",
    psnr: 22.21,
    psnrStd: 1.52,
    ssim: 87.93,
    ssimStd: 2.48,
  },
  {
    method: "DDPM",
    psnr: 25.97,
    psnrStd: 2.09,
    ssim: 90.24,
    ssimStd: 3.41,
  },
  {
    method: "I²SB",
    psnr: 21.8,
    psnrStd: 2.33,
    ssim: 80.75,
    ssimStd: 5.49,
  },
  {
    method: "pix2pix",
    psnr: 26.37,
    psnrStd: 2.07,
    ssim: 91.56,
    ssimStd: 2.81,
  },
];

const systemMetrics: Array<{
  title: string;
  value: string;
  meta: string;
  description: string;
  icon: LucideIcon;
  accentClass: string;
}> = [
  {
    title: "功能测试",
    value: "100%",
    meta: "7/7 项通过",
    description: "上传、生成、对比、下载等核心流程均通过测试。",
    icon: CheckCircle2,
    accentClass: "text-emerald-600",
  },
  {
    title: "生成成功率",
    value: "100%",
    meta: "40/40 样本成功",
    description: "40个测试样本均成功生成目标模态结果。",
    icon: Activity,
    accentClass: "text-teal-600",
  },
  {
    title: "平均推理耗时",
    value: "842.9 ms",
    meta: "后端总推理耗时",
    description: "包含预处理、模型推理、结果恢复和结果保存。",
    icon: Clock3,
    accentClass: "text-secondary",
  },
  {
    title: "端到端返回",
    value: "845.9 ms",
    meta: "P95 858.5 ms",
    description: "从请求发起到结果返回的平均耗时约0.846秒。",
    icon: Server,
    accentClass: "text-secondary",
  },
];

const healthStatus = [
  { label: "服务状态", value: "正常" },
  { label: "接口可用率", value: "100.0%（12/12）" },
  { label: "平均延迟", value: "1.38 ms" },
  { label: "P95延迟", value: "1.52 ms" },
  { label: "模型状态", value: "已加载" },
  { label: "运行设备", value: "自动识别" },
];

const clinicalAuxMetrics: Array<{
  title: string;
  value: string;
  meta: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "强度偏移相关性",
    value: "r = 0.9658",
    meta: "组织级强度变化",
    description: "生成T2与真实T2的跨组织强度偏移模式高度一致。",
    icon: Target,
  },
  {
    title: "分布距离改善",
    value: "7–9×",
    meta: "GM / WM区域",
    description: "灰质和白质区域的EMD、KL分布距离较T1显著改善。",
    icon: GitCompare,
  },
  {
    title: "CNR误差降低",
    value: "约63%",
    meta: "GM-WM组织对",
    description: "生成T2在灰白质对比度层面更接近真实T2。",
    icon: Gauge,
  },
];

const comparisonScale = {
  psnrMax: Math.max(...methodComparisonMetrics.map((item) => item.psnr)),
  ssimMax: Math.max(...methodComparisonMetrics.map((item) => item.ssim)),
};

const generationChartScale = {
  psnrMax: Math.max(...systemGenerationMetrics.map((item) => item.psnr)),
  ssimMax: Math.max(...systemGenerationMetrics.map((item) => item.ssim)),
};

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
          <p className="text-[14px] leading-7 text-muted">
            通过PSNR和SSIM评价生成图像与真实目标模态之间的像素接近程度和结构相似性，并结合公开同类方法结果展示模型选型的合理性。
          </p>

          <div className="space-y-3 rounded-[14px] border border-border bg-bg p-4">
            <h4 className="text-[16px] font-semibold text-text">本系统生成质量结果</h4>
            <p className="text-[13px] leading-6 text-muted">基于BraTS2021和IXI数据集，统计不同模态生成任务下的PSNR和SSIM结果。</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {systemGenerationMetrics.map((item) => (
                <article key={`${item.dataset}-${item.task}`} className="rounded-[14px] border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-text">{item.dataset}</p>
                    <span className="rounded-full border border-border bg-bg px-3 py-1 text-[11px] text-secondary">{item.task}</span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[10px] border border-border bg-bg p-3">
                      <p className="inline-flex items-center gap-1 text-[12px] text-secondary">
                        <BarChart3 size={14} />
                        PSNR
                      </p>
                      <p className="mt-2 text-[24px] font-semibold leading-[1.1] text-text">{item.psnr.toFixed(2)}</p>
                      <p className="mt-1 text-[11px] text-muted">±{item.psnrStd.toFixed(2)} dB</p>
                      <div className="mt-2 h-1.5 rounded-full bg-border/60">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(item.psnr / generationChartScale.psnrMax) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-[10px] border border-border bg-bg p-3">
                      <p className="inline-flex items-center gap-1 text-[12px] text-secondary">
                        <Eye size={14} />
                        SSIM
                      </p>
                      <p className="mt-2 text-[24px] font-semibold leading-[1.1] text-text">{item.ssim.toFixed(2)}%</p>
                      <p className="mt-1 text-[11px] text-muted">±{item.ssimStd.toFixed(2)}%</p>
                      <div className="mt-2 h-1.5 rounded-full bg-border/60">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{ width: `${(item.ssim / generationChartScale.ssimMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[13px] leading-6 text-muted">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-[14px] border border-border bg-bg p-4">
            <h4 className="text-[16px] font-semibold text-text">同类方法对比结果</h4>
            <p className="text-[13px] leading-6 text-muted">
              结合公开同类实验结果，对SelfRDB与代表性生成方法在BraTS2021 T1→T2任务上的表现进行横向对比。
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[12px] border border-border bg-surface p-4">
                <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-text">
                  <BarChart3 size={14} className="text-primary" />
                  PSNR 对比（dB）
                </p>
                <div className="mt-3 space-y-2.5">
                  {methodComparisonMetrics.map((item) => {
                    const width = `${(item.psnr / comparisonScale.psnrMax) * 100}%`;
                    const barClass = item.highlight ? "bg-primary" : "bg-secondary/45";
                    return (
                      <div key={`psnr-${item.method}`} className="space-y-1">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className={`font-medium ${item.highlight ? "text-primary" : "text-text"}`}>{item.method}</span>
                          <span className="text-secondary">{item.psnr.toFixed(2)}±{item.psnrStd.toFixed(2)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-border/60">
                          <div className={`h-full rounded-full ${barClass}`} style={{ width }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-[12px] border border-border bg-surface p-4">
                <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-text">
                  <Eye size={14} className="text-secondary" />
                  SSIM 对比（%）
                </p>
                <div className="mt-3 space-y-2.5">
                  {methodComparisonMetrics.map((item) => {
                    const width = `${(item.ssim / comparisonScale.ssimMax) * 100}%`;
                    const barClass = item.highlight ? "bg-primary" : "bg-secondary/45";
                    return (
                      <div key={`ssim-${item.method}`} className="space-y-1">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className={`font-medium ${item.highlight ? "text-primary" : "text-text"}`}>{item.method}</span>
                          <span className="text-secondary">{item.ssim.toFixed(2)}±{item.ssimStd.toFixed(2)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-border/60">
                          <div className={`h-full rounded-full ${barClass}`} style={{ width }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
            <p className="rounded-[12px] border border-border bg-surface px-4 py-3 text-[13px] leading-6 text-muted">
              SelfRDB 在 BraTS2021 T1→T2 任务中取得 27.42 dB 的 PSNR 和 92.95% 的 SSIM，整体表现优于 SynDiff、DDPM、I²SB 和 pix2pix 等代表性方法。
            </p>
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

          <div className="aspect-[4992/2670] overflow-hidden rounded-[14px] border border-border bg-bg">
            <img src={visualCompareFigure} alt="可视化结果对比" className="h-full w-full object-contain object-center" />
          </div>

          <p className="rounded-[12px] border border-border bg-bg px-4 py-3 text-[13px] leading-6 text-muted">
            用于观察脑室结构、灰白质边界、病灶相关区域和灰度过渡情况。结构越稳定，对多序列对照观察越有参考价值。
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.16}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="clinical-aux-heading">
          <h3 id="clinical-aux-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            临床辅助相关指标
          </h3>
          <p className="text-[14px] leading-7 text-muted">基于组织级强度分布与对比度指标，评估生成T2是否恢复真实T2在主要脑组织区域中的模态特征。</p>
          <div className="grid gap-4 md:grid-cols-3">
            {clinicalAuxMetrics.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[14px] border border-border bg-bg p-4">
                  <p className="inline-flex items-center gap-2 text-[13px] font-medium text-secondary">
                    <Icon size={15} />
                    {item.title}
                  </p>
                  <p className="mt-2 text-[30px] font-semibold leading-[1.12] text-text">{item.value}</p>
                  <p className="mt-1 text-[12px] text-secondary">{item.meta}</p>
                  <p className="mt-3 text-[13px] leading-6 text-muted">{item.description}</p>
                </article>
              );
            })}
          </div>
          <p className="rounded-[12px] border border-border bg-bg px-4 py-3 text-[12px] leading-6 text-muted">
            上述指标属于组织级替代验证结果，主要反映生成T2在强度分布和组织对比度层面的信息补充能力，不直接等同于医生诊断准确率或判读效率提升。
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.18}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="runtime-heading">
          <h3 id="runtime-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            系统运行状态
          </h3>
          <p className="text-[14px] leading-7 text-muted">通过批量测试与接口状态统计，展示系统功能完整性、接口可用性、生成稳定性和响应效率。</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {systemMetrics.map((runtime) => {
              const Icon = runtime.icon;
              return (
                <article key={runtime.title} className="rounded-[14px] border border-border bg-bg p-4">
                  <p className={`inline-flex items-center gap-2 text-[13px] font-medium ${runtime.accentClass}`}>
                    <Icon size={15} />
                    {runtime.title}
                  </p>
                  <p className="mt-2 text-[26px] font-semibold leading-[1.2] text-text">{runtime.value}</p>
                  <p className="mt-1 text-[12px] text-secondary">{runtime.meta}</p>
                  <p className="mt-2 text-[13px] leading-6 text-muted">{runtime.description}</p>
                </article>
              );
            })}
          </div>
          <div className="rounded-[14px] border border-border bg-bg p-4">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-text">
              <CheckCircle2 size={14} className="text-emerald-600" />
              健康检查状态
            </p>
            <div className="mt-2 grid gap-2 text-[13px] leading-6 text-muted md:grid-cols-2">
              {healthStatus.map((item) => (
                <p key={item.label}>
                  {item.label}：{item.value}
                </p>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </section>
  );
};
