import { useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { Upload, X, AlertCircle, Lightbulb, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { uploadedBannersAtom, currentStepAtom } from "../stores";
import { useGenerateBanners } from "../api";
import { DEMO_BANNER_URL } from "../utils/constants";

const GeneratingProgress = () => {
  const STEPS = [
    { label: "参考バナーの訴求力を分析中", progress: 100 },
    { label: "アイキャッチ・読ませる工夫を抽出中", progress: 80 },
    { label: "CVR向上要素を横展開中", progress: 55 },
    { label: "3パターンのバナー画像を生成中", progress: 30 },
  ];
  return (
    <div className="bg-white rounded-2xl border border-violet-100 p-6">
      <h3 className="text-slate-800 mb-4" style={{ fontSize: "15px", fontWeight: 600 }}>生成中...</h3>
      <div className="space-y-3">
        {STEPS.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-600" style={{ fontSize: "12px" }}>{item.label}</span>
              <span className="text-slate-400" style={{ fontSize: "11px" }}>{item.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Step3BannerUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedBanners, setUploadedBanners] = useAtom(uploadedBannersAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);
  const { mutate: generateBanners, isPending } = useGenerateBanners();

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedBanners((prev) => [...prev, ev.target?.result as string]);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(readFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")).forEach(readFile);
  };

  const handleGenerate = () => {
    generateBanners(uploadedBanners, { onSuccess: () => navigate("/project/new-1") });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>参考バナーをアップロード</h2>
        <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>
          広告ライブラリなどで見つけた、効果が良さそうな参考バナーをアップロードしてください。
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Lightbulb size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-700" style={{ fontSize: "13px", fontWeight: 500 }}>効果的な参考バナーの選び方</p>
          <p className="text-blue-600 mt-0.5" style={{ fontSize: "12px", lineHeight: 1.6 }}>
            Facebook広告ライブラリで「長期掲載 = 効果あり」のバナーを探す。競合・類似商材のバナーをスクリーンショットして貼るだけでOK。
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 hover:border-violet-300 rounded-2xl p-10 text-center cursor-pointer transition-all bg-white hover:bg-violet-50/30 group"
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        <div className="w-14 h-14 bg-gray-100 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
          <Upload size={22} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
        </div>
        <h3 className="text-slate-600 group-hover:text-slate-800" style={{ fontSize: "15px", fontWeight: 500 }}>
          クリックまたはドラッグ＆ドロップ
        </h3>
        <p className="text-gray-400 mt-1.5" style={{ fontSize: "12px" }}>PNG, JPG, GIF・最大10MB・複数枚OK</p>
      </div>

      {uploadedBanners.length > 0 && (
        <div>
          <h3 className="text-slate-700 mb-3" style={{ fontSize: "14px", fontWeight: 500 }}>アップロード済み ({uploadedBanners.length}枚)</h3>
          <div className="grid grid-cols-3 gap-3">
            {uploadedBanners.map((src, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
                <img src={src} alt={`参考バナー${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => setUploadedBanners((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 w-6 h-6 bg-slate-900/70 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedBanners.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <AlertCircle size={15} className="text-amber-500 shrink-0" />
          <p className="text-slate-500" style={{ fontSize: "13px" }}>参考バナーを1枚以上アップロードしてください。</p>
          <button
            onClick={() => setUploadedBanners([DEMO_BANNER_URL])}
            className="shrink-0 text-violet-600 hover:text-violet-700 bg-violet-50 rounded-lg px-3 py-1.5 transition-colors"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            デモで試す
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center gap-2 border border-gray-200 text-slate-600 hover:bg-gray-50 rounded-xl px-5 py-3 transition-colors"
          style={{ fontSize: "14px" }}
        >
          <ArrowLeft size={15} />戻る
        </button>
        <button
          onClick={handleGenerate}
          disabled={uploadedBanners.length === 0 || isPending}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl py-3 transition-all shadow-md shadow-violet-200 disabled:shadow-none"
          style={{ fontSize: "14px" }}
        >
          {isPending ? <><Loader2 size={16} className="animate-spin" />AIがバナーを生成中...</> : <><Sparkles size={16} />AIでバナー3パターンを生成する</>}
        </button>
      </div>

      {isPending && <GeneratingProgress />}
    </div>
  );
};
