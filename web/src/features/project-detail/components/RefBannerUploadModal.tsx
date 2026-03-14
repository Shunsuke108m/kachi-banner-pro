import { useState, useRef } from "react";
import { X, Upload, Sparkles } from "lucide-react";
import { useSetAtom } from "jotai";
import { generationsAtom, addGenerationRound } from "../stores";

interface RefBannerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefBannerUploadModal = ({ isOpen, onClose }: RefBannerUploadModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setGenerations = useSetAtom(generationsAtom);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const prev = previewUrl;
    const url = URL.createObjectURL(file);
    if (prev) URL.revokeObjectURL(prev);
    setPreviewUrl(url);
  };

  const handleGenerate = () => {
    addGenerationRound(setGenerations, previewUrl ?? undefined);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-slate-900" style={{ fontSize: "18px", fontWeight: 700 }}>
            参考バナーをアップロードして生成
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {previewUrl ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
              <img src={previewUrl} alt="参考バナー" className="w-full aspect-video object-contain bg-gray-50" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-300 bg-gray-50 hover:bg-violet-50/50 aspect-video flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-4"
            >
              <Upload size={28} />
              <span style={{ fontSize: "14px" }}>画像を選択（1枚）</span>
            </button>
          )}
          <div className="flex gap-2">
            {previewUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 border border-gray-200 text-slate-600 rounded-xl hover:bg-gray-50"
                style={{ fontSize: "14px" }}
              >
                別の画像を選ぶ
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-2.5 transition-colors"
              style={{ fontSize: "14px" }}
            >
              <Sparkles size={16} />3パターン生成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
