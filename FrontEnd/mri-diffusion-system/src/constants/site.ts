export type SectionId = "home" | "features" | "scenarios" | "guide";

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

export type FeatureItem = {
  title: string;
  description: string;
  metric: string;
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

export const navItems: NavItem[] = [
  { id: "home", label: "首页" },
  { id: "features", label: "产品功能" },
  { id: "scenarios", label: "应用场景" },
  { id: "guide", label: "使用说明" },
];

export const heroProofChips: string[] = ["上传即开始", "生成即查看", "对比后导出"];

export const valueCards: ValueCard[] = [
  {
    title: "上传即可开始",
    description: "减少复杂准备步骤，让你更快进入目标模态生成流程。",
  },
  {
    title: "生成结果可直接查看",
    description: "支持原图与结果图联动展示，便于快速完成观察与判断。",
  },
  {
    title: "从体验到导出一步到位",
    description: "不仅能生成结果，还能完成对比、反馈与下载，满足完整使用需求。",
  },
];

export const flowSteps: FlowStep[] = [
  {
    title: "上传图像",
    description: "上传单模态 MRI 图像，立即进入可执行流程。",
  },
  {
    title: "开始生成",
    description: "启动推理任务，持续查看状态与进度反馈。",
  },
  {
    title: "对比结果",
    description: "观察原图与结果差异，更快确认输出质量。",
  },
  {
    title: "下载导出",
    description: "保留结果用于展示、记录与后续分析。",
  },
];

export const featureItems: FeatureItem[] = [
  {
    title: "标准化上传",
    description: "以更少的准备成本开始生成流程。",
    metric: "上传后立即预览",
  },
  {
    title: "自动预处理",
    description: "减少手动整理步骤，让输入更快进入可用状态。",
    metric: "减少重复整理",
  },
  {
    title: "智能生成",
    description: "从单模态图像快速获得目标模态结果。",
    metric: "生成链路持续可见",
  },
  {
    title: "对比查看",
    description: "直接观察原图与结果之间的结构和灰度差异。",
    metric: "支持联动缩放与滑块",
  },
  {
    title: "结果导出",
    description: "保留结果用于展示、记录与后续分析。",
    metric: "一键下载可归档",
  },
];

export const featureHighlights: FeatureHighlight[] = [
  {
    title: "直接开始任务",
    description: "减少概念解释，优先展示可操作界面和关键动作。",
  },
  {
    title: "持续看到反馈",
    description: "每一步都给出状态变化，降低等待过程的不确定感。",
  },
  {
    title: "快速完成验证",
    description: "通过对比与下载动作，快速形成可用结果与记录。",
  },
  {
    title: "平滑接入后端",
    description: "保留清晰组件边界，后续联调时更易扩展维护。",
  },
];

export const scenarioItems: ScenarioItem[] = [
  {
    sceneLabel: "场景一：医学教学",
    title: "教学演示",
    description:
      "通过目标模态生成与结果对照展示，帮助学习者更直观地理解不同 MRI 模态之间的成像差异与结构对应关系。",
    audience: "医学教师｜学生｜教学实验人员",
  },
  {
    sceneLabel: "场景二：科研验证",
    title: "科研验证",
    description:
      "面向模态补全、结果观察与可视化分析等需求，支持研究人员更高效地完成样例展示、实验记录与方法验证。",
    audience: "科研人员｜研究生｜算法开发者",
  },
  {
    sceneLabel: "场景三：智能分析辅助",
    title: "分析前处理",
    description:
      "为分割、检测及相关研究型智能处理流程提供补充模态参考，帮助构建更完整的输入条件。",
    audience: "开发者｜研究人员｜医学影像处理人员",
  },
];

export const scenarioPathItems: ScenarioPathItem[] = [
  {
    title: "教学展示",
    flow: "上传图像 → 生成目标模态 → 对照展示结果 → 辅助课堂讲解",
  },
  {
    title: "科研分析",
    flow: "导入样本 → 完成生成 → 查看结构差异 → 导出结果用于记录与汇报",
  },
  {
    title: "流程辅助",
    flow: "生成补充模态 → 接入后续分析步骤 → 支持更完整的研究型处理流程",
  },
];

export const guideSteps: GuideStep[] = [
  {
    title: "1. 上传图像",
    description:
      "选择待处理的单模态脑 MRI 图像，点击上传或直接拖拽到上传区域，系统会立即显示原图预览。",
    statusHint: "状态：idle -> uploading",
  },
  {
    title: "2. 确认输入",
    description: "检查图像内容与预览状态，确认当前输入无误后，进入生成流程。",
    statusHint: "状态：ready",
  },
  {
    title: "3. 开始生成",
    description:
      "点击“开始生成”，系统自动完成预处理、模型推理与结果恢复，并在过程中提供状态反馈。",
    statusHint: "状态：processing",
  },
  {
    title: "4. 查看对比",
    description:
      "生成完成后，可在结果区查看目标模态图像，并通过联动缩放或滑块方式对比原图与结果差异。",
    statusHint: "状态：success / error",
  },
  {
    title: "5. 下载结果",
    description: "确认结果后，点击下载按钮导出生成图像，便于后续展示、记录与进一步使用。",
    statusHint: "状态：download-ready",
  },
];

export const guideTips: string[] = [
  "建议上传清晰、有效的脑 MRI 图像，以获得更稳定的生成结果。",
  "生成过程可能需要短暂等待，请根据页面状态提示进行操作。",
  "对比查看功能可帮助你更直观地观察结构变化与灰度差异。",
  "下载后的结果可用于教学展示、实验记录与资料整理。",
];

export const faqItems: FaqItem[] = [
  {
    question: "1. 支持上传什么内容？",
    answer: "建议上传单模态脑 MRI 图像。系统会在上传后显示原图预览，便于确认输入是否正确。",
  },
  {
    question: "2. 点击生成后会发生什么？",
    answer: "系统会自动执行预处理、模型推理与结果恢复流程，并在页面中反馈当前处理状态。",
  },
  {
    question: "3. 如何查看原图与结果的差异？",
    answer: "生成完成后，可使用联动缩放或滑块对比功能，直接观察原图与结果图之间的变化。",
  },
  {
    question: "4. 结果可以下载吗？",
    answer: "可以。生成完成后可直接下载结果图像，用于展示、记录或进一步分析。",
  },
];
