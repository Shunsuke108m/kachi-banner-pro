import { Globe, Users, ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import { type Step } from "../types";

const STEPS = [
  { id: 1, label: "LP分析", icon: Globe },
  { id: 2, label: "ターゲット確認", icon: Users },
  { id: 3, label: "参考バナー", icon: ImageIcon },
  { id: 4, label: "バナー生成", icon: Sparkles },
] as const;

interface Props {
  currentStep: Step;
}

export const StepIndicator = ({ currentStep }: Props) => (
  <div className="flex items-center mb-10">
    {STEPS.map((step, index) => (
      <div key={step.id} className="flex items-center flex-1 last:flex-none">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              currentStep > step.id
                ? "bg-emerald-500 text-white"
                : currentStep === step.id
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {currentStep > step.id ? <CheckCircle2 size={15} /> : <step.icon size={14} />}
          </div>
          <span
            className="hidden sm:block transition-colors"
            style={{
              fontSize: "13px",
              fontWeight: currentStep === step.id ? 600 : 400,
              color:
                currentStep === step.id ? "#7C3AED" : currentStep > step.id ? "#059669" : "#9CA3AF",
            }}
          >
            {step.label}
          </span>
        </div>
        {index < STEPS.length - 1 && (
          <div className={`flex-1 h-px mx-3 transition-colors ${currentStep > step.id ? "bg-emerald-300" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
  </div>
);
