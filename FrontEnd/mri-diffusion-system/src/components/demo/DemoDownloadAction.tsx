import { Download } from "lucide-react";

type DemoDownloadActionProps = {
  disabled: boolean;
  onDownload: () => void;
};

export const DemoDownloadAction = ({ disabled, onDownload }: DemoDownloadActionProps) => {
  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-surface transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={14} />
      下载结果
    </button>
  );
};
