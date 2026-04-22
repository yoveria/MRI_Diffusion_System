import axios from "axios";

type GenerateApiPayload = {
  success?: boolean;
  result_url?: string;
  message?: string;
};

type GenerateParams = {
  file: File;
  signal: AbortSignal;
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void;
};

export type GenerateResult = {
  resultUrl: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

const resolveResultUrl = (rawUrl: string): string => {
  if (rawUrl.startsWith("http") || rawUrl.startsWith("blob:") || rawUrl.startsWith("data:")) {
    return rawUrl;
  }

  if (rawUrl.startsWith("/")) {
    return `${API_BASE_URL}${rawUrl}`;
  }

  return `${API_BASE_URL}/${rawUrl}`;
};

export const generateMriResult = async ({ file, signal, onUploadProgress }: GenerateParams): Promise<GenerateResult> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post<GenerateApiPayload>(`${API_BASE_URL}/api/generate`, formData, {
    signal,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      onUploadProgress?.({ loaded: event.loaded, total: event.total });
    },
  });

  const payload = response.data;
  const rawUrl = payload?.result_url;

  if (!payload?.success || !rawUrl) {
    throw new Error(payload?.message || "后端未返回可用结果。请稍后重试。");
  }

  return {
    resultUrl: resolveResultUrl(rawUrl),
  };
};
