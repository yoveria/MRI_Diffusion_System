import { BrainCircuit, Download, ScanSearch, UploadCloud } from "lucide-react";
import demoVideo from "../figure/演示视频.mp4";
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
          <div className="rounded-[14px] border border-border bg-bg p-4">
            <p className="text-[13px] font-medium tracking-[0.01em] text-secondary">演示视频</p>
            <div className="mt-3 aspect-video overflow-hidden rounded-[10px] border border-border bg-bg">
              <video className="h-full w-full object-cover" controls preload="metadata">
                <source src={demoVideo} type="video/mp4" />
                当前浏览器不支持视频播放。
              </video>
            </div>
            <div className="mt-3 rounded-[8px] border border-border bg-surface px-3 py-2 text-[12px] text-muted">
              从图像上传到目标模态生成与对照观察，完整展示在线体验流程。
            </div>
          </div>
        </section>
      </Reveal>
    </section>
  );
};
