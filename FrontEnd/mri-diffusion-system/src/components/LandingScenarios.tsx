import { ArrowRightCircle, CheckCircle2 } from "lucide-react";
import assistedReadingImage from "../figure/辅助判读.jpg";
import downstreamImage from "../figure/分割.png";
import researchImage from "../figure/科研.jpg";
import teachingImage from "../figure/教学.jpg";
import { Reveal } from "./Reveal";

type CoreScenario = {
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  audience: string;
  image: string;
};

type ExtendedScenario = {
  tag: string;
  title: string;
  description: string;
  audience: string;
  image: string;
};

type ScenarioPath = {
  title: string;
  tag: string;
  flow: string;
  description: string;
};

const scenariosSubtitle =
  "以脑肿瘤MRI模态补全为核心，面向辅助判读、教学展示、科研验证和下游任务分析提供多层次应用支持。";

const coreScenario: CoreScenario = {
  tag: "核心场景",
  title: "辅助判读",
  description:
    "面向脑肿瘤MRI模态缺失场景，系统可生成目标模态影像，为多序列对照观察、病灶区域理解和影像分析提供补充信息。",
  highlights: ["补全缺失模态", "支持多序列对照", "辅助病灶区域理解"],
  audience: "影像科医生｜住院医师｜医学影像处理人员｜科研人员",
  image: assistedReadingImage,
};

const extendedScenarios: ExtendedScenario[] = [
  {
    tag: "教学展示",
    title: "医学影像教学",
    description: "展示不同MRI模态下脑组织结构与病灶表现差异，辅助学习者理解多模态影像信息。",
    audience: "医学教师｜学生｜教学实验人员",
    image: teachingImage,
  },
  {
    tag: "科研分析",
    title: "科研实验验证",
    description: "支持模态补全、方法对比、结果可视化和实验分析，为医学影像生成研究提供参考。",
    audience: "科研人员｜研究生｜算法开发者",
    image: researchImage,
  },
  {
    tag: "任务拓展",
    title: "下游任务辅助",
    description:
      "生成目标模态可作为脑肿瘤分割、检测等任务的补充输入，为后续AI辅助诊断系统开发提供数据补充与方法验证支撑。",
    audience: "开发者｜研究人员｜医学影像处理人员",
    image: downstreamImage,
  },
];

const scenarioPaths: ScenarioPath[] = [
  {
    title: "辅助判读路径",
    tag: "核心场景",
    flow: "上传单模态MRI → 生成目标模态 → 多模态对照观察 → 辅助病灶区域理解",
    description: "适用于脑肿瘤MRI模态缺失情况下的多序列对照观察。",
  },
  {
    title: "教学科研路径",
    tag: "扩展应用",
    flow: "选择示例图像 → 生成目标模态 → 展示模态差异 → 用于教学或实验分析",
    description: "适用于医学影像教学、模态差异展示和方法验证。",
  },
  {
    title: "下游分析路径",
    tag: "任务拓展",
    flow: "输入已有模态 → 生成补充模态 → 组合多模态输入 → 支持分割/检测任务",
    description: "适用于探索生成模态对脑肿瘤分割、检测等任务的辅助价值。",
  },
];

export const Scenarios = () => {
  return (
    <section id="scenarios" className="scroll-mt-28 space-y-8" aria-labelledby="scenarios-heading">
      <Reveal className="space-y-3" delay={0.03}>
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-secondary">APPLICATION SCENARIOS</p>
        <h2 id="scenarios-heading" className="font-serif text-[38px] font-semibold leading-[1.25] text-text">
          应用场景
        </h2>
        <p className="max-w-4xl text-[16px] leading-[1.82] text-muted">{scenariosSubtitle}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <article className="rounded-card border border-border bg-surface p-6 shadow-soft lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-6">
          <div>
            <p className="inline-flex rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[12px] font-medium text-secondary">
              {coreScenario.tag}
            </p>
            <h3 className="mt-3 text-[30px] font-semibold leading-[1.25] text-text">{coreScenario.title}</h3>
            <p className="mt-3 text-[15px] leading-7 text-muted">{coreScenario.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {coreScenario.highlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-bg px-3 py-1 text-[12px] font-medium text-muted"
                >
                  <CheckCircle2 size={12} className="text-accent" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-[12px] border border-border bg-bg px-4 py-3">
              <p className="text-[13px] font-medium text-secondary">适用人群</p>
              <p className="mt-1 text-[14px] leading-7 text-muted">{coreScenario.audience}</p>
            </div>
          </div>

          <div className="mt-4 aspect-[16/10] overflow-hidden rounded-[12px] border border-border bg-bg lg:mt-0 lg:aspect-[4/3]">
            <img src={coreScenario.image} alt="辅助判读场景示意图" className="h-full w-full object-cover object-center" />
          </div>
        </article>
      </Reveal>

      <Reveal delay={0.09}>
        <div className="grid gap-4 lg:grid-cols-3">
          {extendedScenarios.map((scenario) => (
            <article key={scenario.title} className="flex h-full flex-col rounded-card border border-border bg-surface p-5 shadow-soft">
              <div className="aspect-[4/3] overflow-hidden rounded-[10px] border border-border bg-bg">
                <img src={scenario.image} alt={`${scenario.title}场景示意图`} className="h-full w-full object-cover object-center" />
              </div>

              <p className="mt-4 text-[12px] font-medium tracking-[0.01em] text-secondary">{scenario.tag}</p>
              <h3 className="mt-2 text-[22px] font-semibold leading-[1.35] text-text">{scenario.title}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-7 text-muted">{scenario.description}</p>

              <div className="mt-3 rounded-[12px] border border-border bg-bg px-3 py-3">
                <p className="text-[12px] font-medium text-secondary">适用人群</p>
                <p className="mt-1 text-[13px] leading-6 text-muted">{scenario.audience}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <section className="space-y-4 rounded-card border border-border bg-surface p-6 shadow-soft" aria-labelledby="path-heading">
          <h3 id="path-heading" className="font-serif text-[28px] font-semibold leading-[1.3] text-text">
            你可以这样使用它
          </h3>
          <p className="text-[15px] leading-7 text-muted">从图像输入到结果对照，快速完成目标模态生成与应用分析。</p>

          <div className="grid gap-3 md:grid-cols-3">
            {scenarioPaths.map((path) => (
              <article key={path.title} className="rounded-[14px] border border-border bg-bg px-4 py-4">
                <p className="inline-flex rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-[11px] font-medium text-secondary">
                  {path.tag}
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text">{path.title}</p>
                <p className="mt-2 text-[14px] leading-7 text-muted">{path.flow}</p>
                <p className="mt-2 text-[13px] leading-6 text-muted">{path.description}</p>
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
