import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { currentStepAtom } from "./stores";
import { StepIndicator } from "./components/StepIndicator";
import { Step1LpAnalysis } from "./components/Step1LpAnalysis";
import { Step2TargetEdit } from "./components/Step2TargetEdit";
import { Step3BannerUpload } from "./components/Step3BannerUpload";

export const NewProject = () => {
  const navigate = useNavigate();
  const currentStep = useAtomValue(currentStepAtom);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors"
            style={{ fontSize: "13px" }}
          >
            <ArrowLeft size={15} />
            戻る
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <h1 className="text-slate-800" style={{ fontSize: "16px", fontWeight: 600 }}>新規バナー生成</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <StepIndicator currentStep={currentStep} />
        {currentStep === 1 && <Step1LpAnalysis />}
        {currentStep === 2 && <Step2TargetEdit />}
        {currentStep === 3 && <Step3BannerUpload />}
      </div>
    </div>
  );
};
