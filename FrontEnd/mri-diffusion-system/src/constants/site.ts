export type SectionId = "home" | "capabilities" | "reliability" | "scenarios" | "demo";

export type NavItem = {
  id: SectionId;
  label: string;
};

export type ValueCard = {
  title: string;
  description: string;
};

export type FlowStep = {
  title: string;
  description: string;
};

export type CapabilityItem = {
  title: string;
  tag: string;
  description: string;
};

export type FeatureHighlight = {
  title: string;
  description: string;
};

export type ScenarioItem = {
  sceneLabel: string;
  title: string;
  description: string;
  audience: string;
};

export type ScenarioPathItem = {
  title: string;
  flow: string;
};

export type GuideStep = {
  title: string;
  description: string;
  statusHint: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ReliabilityDatasetCard = {
  title: string;
  tag: string;
  dataType: string;
  modalities: string;
  purpose: string;
};

export type ReliabilityMetricCard = {
  metric: string;
  value: string;
  source: string;
  description: string;
};

export type ReliabilityRuntimeCard = {
  metric: string;
  value: string;
  description: string;
};

export const navItems: NavItem[] = [
  { id: "home", label: "首页" },
  { id: "capabilities", label: "产品能力" },
  { id: "reliability", label: "可靠性验证" },
  { id: "scenarios", label: "应用场景" },
  { id: "demo", label: "在线体验" },
];

export const heroBadge = "AI驱动的脑肿瘤MRI模态补全工具";

export const heroTitle = "补全影像，看见更多";

export const heroSubtitle =
  "面对脑肿瘤MRI模态缺失，完整影像信息是辅助观察的关键。别让缺失模态限制病灶理解，用AI补全多序列视角，让影像分析更清晰、更高效、更有依据。";

export const heroProofChips: string[] = ["缺失模态补全", "多序列对照观察", "辅助影像分析"];

export const valueCards: ValueCard[] = [
  {
    title: "缺失模态补全",
    description: "单模态输入，生成目标MRI模态",
  },
  {
    title: "多序列对照观察",
    description: "原图与生成图并排、缩放、滑块对比",
  },
  {
    title: "辅助影像分析",
    description: "为病灶区域理解和后续任务提供补充信息",
  },
];

export const flowSteps: FlowStep[] = [
  {
    title: "上传图像",
    description: "选择单模态脑肿瘤MRI图像，进入在线体验流程。",
  },
  {
    title: "目标模态生成",
    description: "调用扩散模型，完成由源模态到目标模态的生成。",
  },
  {
    title: "多模态对照",
    description: "并排、缩放、滑块对比，观察结构边界和灰度差异。",
  },
  {
    title: "下载导出",
    description: "将生成结果用于教学展示、科研验证和后续分析。",
  },
];

export const capabilitiesSubtitle =
  "围绕脑肿瘤MRI模态缺失场景，提供从图像接入、AI生成到多模态对照的完整能力。";

export const capabilityItems: CapabilityItem[] = [
  {
    title: "图像接入",
    tag: "Upload",
    description: "支持单模态脑MRI影像上传、预览与格式校验，帮助用户快速完成输入准备。",
  },
  {
    title: "智能生成",
    tag: "AI Generation",
    description: "基于扩散模型生成目标模态影像，实现由已有模态到缺失模态的补全。",
  },
  {
    title: "对照观察",
    tag: "Compare",
    description: "支持原图与生成图并排展示、联动缩放和滑块式对比，便于观察结构边界与灰度差异。",
  },
  {
    title: "结果导出",
    tag: "Export",
    description: "支持生成结果下载，便于用于教学展示、科研分析或后续任务处理。",
  },
];

export const featureHighlights: FeatureHighlight[] = [
  {
    title: "流程化能力闭环",
    description: "从图像接入到结果导出，全流程围绕目标模态生成和多模态对照设计。",
  },
  {
    title: "可解释的观察体验",
    description: "通过并排显示和滑块对比减少黑盒感，强调结构与灰度差异的可观察性。",
  },
  {
    title: "面向辅助判读场景",
    description: "聚焦脑肿瘤MRI模态缺失问题，为辅助判读和教学科研提供补充信息。",
  },
  {
    title: "工程化在线体验",
    description: "保留上传、生成、对比、下载和状态反馈，形成可演示的产品化体验。",
  },
];

export const reliabilitySubtitle =
  "通过公开脱敏数据、生成质量指标、可视化对比和系统运行结果，多维度呈现产品可靠性。";

export const reliabilityDatasets: ReliabilityDatasetCard[] = [
  {
    title: "BraTS2021",
    tag: "脑肿瘤MRI数据",
    dataType: "公开脱敏多模态脑MRI",
    modalities: "T1 / T2 / FLAIR / T1ce",
    purpose: "复杂病灶场景验证",
  },
  {
    title: "IXI",
    tag: "健康脑MRI数据",
    dataType: "公开脱敏多模态脑MRI",
    modalities: "T1 / T2 / PD",
    purpose: "规则脑结构场景补充验证",
  },
];

export const reliabilityMetrics: ReliabilityMetricCard[] = [
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

export const reliabilityRuntime: ReliabilityRuntimeCard[] = [
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

export const reliabilityHealthLines: string[] = [
  "服务状态：正常",
  "模型状态：已加载",
  "运行设备：GPU / CPU 自动识别",
  "接口状态：可访问",
];

export const scenarioItems: ScenarioItem[] = [
  {
    sceneLabel: "核心场景",
    title: "辅助判读",
    description:
      "面向脑肿瘤MRI模态缺失场景，生成目标模态影像，为多序列对照观察和病灶区域理解提供补充信息。",
    audience: "影像科医生｜住院医师｜科研人员",
  },
  {
    sceneLabel: "教学展示",
    title: "医学影像教学",
    description:
      "展示不同MRI模态下脑组织结构与病灶表现差异，辅助学习者理解多模态影像信息。",
    audience: "医学教师｜学生｜教学实验人员",
  },
  {
    sceneLabel: "科研分析",
    title: "科研实验验证",
    description:
      "支持模态补全、方法对比、结果可视化和实验分析，为医学影像生成研究提供参考。",
    audience: "科研人员｜研究生｜算法开发者",
  },
  {
    sceneLabel: "任务拓展",
    title: "下游任务辅助",
    description:
      "生成目标模态可作为脑肿瘤分割、检测等任务的补充输入，为后续AI辅助诊断系统开发提供数据补充与方法验证支撑。",
    audience: "开发者｜研究人员｜医学影像处理人员",
  },
];

export const scenarioPathItems: ScenarioPathItem[] = [
  {
    title: "辅助判读",
    flow: "源模态输入 → 目标模态生成 → 多模态对照观察 → 辅助病灶区域理解",
  },
  {
    title: "教学展示",
    flow: "上传MRI样本 → 展示多模态差异 → 讲解结构边界与灰度变化",
  },
  {
    title: "科研验证",
    flow: "模态补全实验 → 指标评估 → 结果可视化 → 方法对比分析",
  },
];

export const guideSteps: GuideStep[] = [
  {
    title: "1. 上传图像",
    description: "选择或拖拽单模态脑MRI影像，系统将立即显示源模态预览。",
    statusHint: "状态：等待上传",
  },
  {
    title: "2. 选择任务",
    description: "确认当前任务为 T1 → T2，后续可扩展到更多目标模态。",
    statusHint: "状态：任务已就绪",
  },
  {
    title: "3. 启动生成",
    description: "调用扩散模型进行目标模态生成，并持续反馈任务进度。",
    statusHint: "状态：模型推理中",
  },
  {
    title: "4. 对比下载",
    description: "通过多模态对照观察确认结果后，下载生成图像。",
    statusHint: "状态：生成完成",
  },
];

export const guideTips: string[] = [
  "建议上传清晰的脑MRI切片，以获得更稳定的目标模态生成效果。",
  "生成耗时与设备、图像尺寸和模型配置有关，页面会显示实时状态。",
  "多模态滑块对比可辅助观察脑室结构、灰白质边界和灰度过渡。",
  "当前官网用于研究与演示场景，避免将生成结果用于临床诊断结论。",
];

export const faqItems: FaqItem[] = [
  {
    question: "1. 支持哪些图像格式？",
    answer: "当前在线Demo支持 JPG、PNG、JPEG、WEBP 等二维图像文件。",
  },
  {
    question: "2. 当前支持哪些生成任务？",
    answer: "当前Demo重点展示 T1 → T2 单向生成任务，其他模态组合可作为后续扩展方向。",
  },
  {
    question: "3. 生成大约需要多久？",
    answer: "生成耗时与运行设备、图像尺寸和模型配置有关，页面会显示实时处理状态。",
  },
  {
    question: "4. 结果是否可以下载？",
    answer: "可以。生成完成后可下载目标模态图像，用于展示、分析或后续任务处理。",
  },
  {
    question: "5. 上传失败或生成失败怎么办？",
    answer: "请检查图像格式是否受支持，或重新上传清晰的脑MRI切片后再次尝试。",
  },
];
