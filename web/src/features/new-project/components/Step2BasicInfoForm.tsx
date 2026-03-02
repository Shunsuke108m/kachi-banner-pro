import { useAtom } from "jotai";
import { lpAnalysisAtom } from "../stores";
import { type LPAnalysis } from "../types";

const BASIC_FIELDS: { label: string; key: keyof LPAnalysis }[] = [
  { label: "商品名", key: "productName" },
  { label: "カテゴリ", key: "category" },
  { label: "ターゲット年齢", key: "targetAge" },
  { label: "ターゲット性別", key: "targetGender" },
  { label: "推定年収", key: "targetIncome" },
  { label: "職業・属性", key: "targetJob" },
];

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-slate-700 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all";

export const Step2BasicInfoForm = () => {
  const [analysis, setAnalysis] = useAtom(lpAnalysisAtom);

  const handleChange = (key: keyof LPAnalysis, value: string) => {
    setAnalysis((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {BASIC_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-slate-500 mb-1.5" style={{ fontSize: "12px" }}>{field.label}</label>
            <input
              type="text"
              value={analysis[field.key] as string}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={inputClass}
              style={{ fontSize: "13px" }}
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-slate-500 mb-1.5" style={{ fontSize: "12px" }}>メインメッセージ</label>
        <input
          type="text"
          value={analysis.mainMessage}
          onChange={(e) => handleChange("mainMessage", e.target.value)}
          className={inputClass}
          style={{ fontSize: "13px" }}
        />
      </div>
      <div>
        <label className="block text-slate-500 mb-1.5" style={{ fontSize: "12px" }}>CTAテキスト</label>
        <input
          type="text"
          value={analysis.cta}
          onChange={(e) => handleChange("cta", e.target.value)}
          className={inputClass}
          style={{ fontSize: "13px" }}
        />
      </div>
    </div>
  );
};
