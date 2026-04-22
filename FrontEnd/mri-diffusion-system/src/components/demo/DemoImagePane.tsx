type DemoImagePaneProps = {
  title: string;
  subtitle: string;
  imageUrl: string | null;
  emptyText: string;
  zoom: number;
};

export const DemoImagePane = ({ title, subtitle, imageUrl, emptyText, zoom }: DemoImagePaneProps) => {
  return (
    <article className="overflow-hidden rounded-[14px] border border-border bg-surface" aria-label={title}>
      <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-3">
        <h4 className="text-[14px] font-semibold text-text">{title}</h4>
        <span className="font-mono text-[12px] text-secondary">{subtitle}</span>
      </div>
      <div
        className={`relative flex items-center justify-center overflow-hidden p-4 ${imageUrl ? "" : "min-h-[270px]"}`}
      >
        {imageUrl ? (
          <div className="w-full overflow-hidden rounded-[12px] border border-border bg-bg p-2">
            <img
              src={imageUrl}
              alt={title}
              className="mx-auto h-auto max-h-[360px] w-auto max-w-full object-contain transition duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            />
          </div>
        ) : (
          <p className="text-center text-[13px] leading-6 text-muted">{emptyText}</p>
        )}
      </div>
    </article>
  );
};
