import { useNavigate } from "react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  "LP分析 → ターゲット設定",
  "参考バナーをアップロード",
  "3パターン自動生成",
] as const;

export const QuickStartBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
        <div className="absolute top-4 right-8 w-32 h-32 bg-white rounded-full" />
        <div className="absolute bottom-2 right-2 w-20 h-20 bg-white rounded-full" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>今すぐバナーを生成する</h2>
          <p className="text-violet-200 mt-1" style={{ fontSize: "13px" }}>
            LPのURLを貼るだけで、そのまま配信できる品質のバナーが約1〜2分で完成
          </p>
          <div className="flex items-center gap-4 mt-3">
            {STEPS.map((step) => (
              <div key={step} className="flex items-center gap-1.5 text-violet-200" style={{ fontSize: "12px" }}>
                <CheckCircle2 size={13} />
                {step}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate("/new")}
          className="flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 rounded-xl px-5 py-2.5 shrink-0 transition-colors shadow-lg"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          はじめる
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
