import { FileImage, UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type DemoUploaderProps = {
  file: File | null;
  disabled: boolean;
  onFileSelected: (file: File) => void;
};

export const DemoUploader = ({ file, disabled, onFileSelected }: DemoUploaderProps) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0];
      if (selected) {
        onFileSelected(selected);
      }
    },
    [onFileSelected],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    disabled,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
  });

  return (
    <section className="rounded-[14px] border border-border bg-bg p-4" aria-label="上传区">
      <div
        {...getRootProps()}
        className={`rounded-[12px] border border-dashed p-5 text-center transition ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-surface"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-7 w-7 text-secondary" />
        <p className="mt-3 text-[14px] font-medium text-text">拖拽图像到此处或点击选择</p>
        <p className="mt-1 text-[12px] leading-6 text-muted">支持 JPG / PNG / WEBP，后续可按后端能力扩展</p>
        <button
          type="button"
          onClick={open}
          disabled={disabled}
          className="mt-3 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          选择图像
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-[12px] border border-border bg-surface px-3 py-2">
        <FileImage size={16} className="text-secondary" />
        <p className="truncate text-[12px] text-muted">{file ? `已选择：${file.name}` : "尚未选择图像"}</p>
      </div>
    </section>
  );
};
