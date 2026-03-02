import { useAtom, useSetAtom } from "jotai";
import { Target, AlertCircle, Edit3, ArrowLeft, ChevronRight, Lightbulb } from "lucide-react";
import { currentStepAtom, lpAnalysisAtom } from "../stores";
import { Step2BasicInfoForm } from "./Step2BasicInfoForm";
import { Step2PainDesirePanel } from "./Step2PainDesirePanel";

export const Step2TargetEdit = () => {
  const [analysis, setAnalysis] = useAtom(lpAnalysisAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);

  const updatePains = (pains: string[]) => setAnalysis((prev) => ({ ...prev, pains }));
  const updateDesires = (desires: string[]) => setAnalysis((prev) => ({ ...prev, desires }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>ターゲット・インサイトを確認・編集</h2>
          <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>AIが分析した内容を確認し、必要に応じて修正してください。</p>
        </div>
        <div className="flex items-center gap-1.5 text-violet-600 bg-violet-50 rounded-lg px-3 py-1.5">
          <Edit3 size={13} />
          <span style={{ fontSize: "12px" }}>編集可能</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-slate-800 mb-4 flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}>
          <Lightbulb size={16} className="text-amber-500" />
          基本情報・メッセージ
        </h3>
        <Step2BasicInfoForm />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Step2PainDesirePanel
          title="ペイン（悩み・課題）"
          items={analysis.pains}
          color="red"
          icon={AlertCircle}
          onUpdate={updatePains}
        />
        <Step2PainDesirePanel
          title="デザイア（欲求・理想）"
          items={analysis.desires}
          color="emerald"
          icon={Target}
          onUpdate={updateDesires}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center gap-2 border border-gray-200 text-slate-600 hover:bg-gray-50 rounded-xl px-5 py-3 transition-colors"
          style={{ fontSize: "14px" }}
        >
          <ArrowLeft size={15} />戻る
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 transition-colors"
          style={{ fontSize: "14px" }}
        >
          参考バナーをアップロードする
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
