import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Edit3, ArrowLeft, ChevronRight } from "lucide-react";
import { currentStepAtom, lpStructuredContextAtom } from "../stores";
import { type LpStructuredContext } from "../types";

type SimpleSectionKey = keyof Pick<
  LpStructuredContext,
  "coreValue" | "mainTarget" | "competitiveAdvantage"
>;

interface SimpleSectionProps {
  label: string;
  field: SimpleSectionKey;
  value: string;
  placeholder: string;
  onSave: (field: SimpleSectionKey, value: string) => void;
}

const SimpleEditableSection = ({ label, field, value, placeholder, onSave }: SimpleSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(field, draft);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-slate-800" style={{ fontSize: "14px", fontWeight: 600 }}>
          {label}
        </h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700 text-xs"
          >
            <Edit3 size={13} />
            編集
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs"
          >
            保存
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2 text-slate-700 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 text-sm resize-y"
        />
      ) : (
        <p
          className={`text-sm ${
            value ? "text-slate-700" : "text-slate-400 italic"
          } whitespace-pre-line`}
        >
          {value || placeholder}
        </p>
      )}
    </div>
  );
};

interface ListSectionProps {
  label: string;
  field: keyof Pick<LpStructuredContext, "functionalBenefits" | "emotionalBenefits">;
  values: string[];
  placeholder: string;
  onSave: (field: "functionalBenefits" | "emotionalBenefits", values: string[]) => void;
}

const ListEditableSection = ({ label, field, values, placeholder, onSave }: ListSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(values.join("\n"));

  const handleSave = () => {
    const next = draft
      .split(/\r?\n/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    onSave(field, next);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-slate-800" style={{ fontSize: "14px", fontWeight: 600 }}>
          {label}
        </h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setDraft(values.join("\n"));
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700 text-xs"
          >
            <Edit3 size={13} />
            編集
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs"
          >
            保存
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2 text-slate-700 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 text-sm resize-y"
        />
      ) : values.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
          {values.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">{placeholder}</p>
      )}
    </div>
  );
};

export const Step2TargetEdit = () => {
  const [structured, setStructured] = useAtom(lpStructuredContextAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);


  const handleSaveSimple = (field: SimpleSectionKey, value: string) => {
    setStructured((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveList = (
    field: "functionalBenefits" | "emotionalBenefits",
    values: string[],
  ) => {
    setStructured((prev) => ({ ...prev, [field]: values }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>ターゲット・インサイトを確認・編集</h2>
          <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>AIが分析した内容を確認し、必要に応じて修正してください。</p>
        </div>
        <div className="flex items-center gap-1.5 text-violet-600 bg-violet-50 rounded-lg px-3 py-1.5">
          <Edit3 size={13} />
          <span style={{ fontSize: "12px" }}>項目ごとに編集可能</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SimpleEditableSection
            label="コアバリュー"
            field="coreValue"
            value={structured.coreValue}
            placeholder="例: 「忙しくても続けられる、ストレスフリーなダイエット習慣」など"
            onSave={handleSaveSimple}
          />
          <SimpleEditableSection
            label="メインターゲット"
            field="mainTarget"
            value={structured.mainTarget}
            placeholder="例: 30〜40代の仕事と家事で忙しい女性 など"
            onSave={handleSaveSimple}
          />
          <SimpleEditableSection
            label="競合優位性"
            field="competitiveAdvantage"
            value={structured.competitiveAdvantage}
            placeholder="例: 臨床試験データ / 定期縛りなし など"
            onSave={handleSaveSimple}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ListEditableSection
            label="機能的ベネフィット（スペック・事実）"
            field="functionalBenefits"
            values={structured.functionalBenefits}
            placeholder="例:\n・〇〇成分を高配合\n・1日1粒でOK\n・定期縛りなし など"
            onSave={handleSaveList}
          />
          <ListEditableSection
            label="情緒的ベネフィット（得られる安心感や優越感）"
            field="emotionalBenefits"
            values={structured.emotionalBenefits}
            placeholder="例:\n・着たい服が着られる\n・体型の悩みから解放される など"
            onSave={handleSaveList}
          />
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
      </div> */}

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
