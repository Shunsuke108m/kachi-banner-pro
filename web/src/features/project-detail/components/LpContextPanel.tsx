import { useState } from "react";
import { Edit3, Save, Loader2, AlertCircle } from "lucide-react";
import { type LpStructuredContext, useProject, useUpdateLpContext } from "../api";
import { useParams } from "react-router";

type SectionKey = keyof Pick<
  LpStructuredContext,
  "coreValue" | "mainTarget" | "competitiveAdvantage"
>;

interface EditableSectionProps {
  label: string;
  placeholder: string;
  field: SectionKey;
  value: string;
  onSave: (field: SectionKey, value: string) => Promise<void>;
}

const EditableSection = ({ label, placeholder, field, value, onSave }: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(field, draft);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
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
            disabled={isSaving}
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs disabled:opacity-60"
          >
            {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
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

export const LpContextPanel = () => {
  const params = useParams();
  const projectId = params.id ?? "demo-project";
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const updateLpContext = useUpdateLpContext(projectId);

  const handleSaveField = async (field: SectionKey, value: string) => {
    if (!project) return;
    const next: LpStructuredContext = {
      ...project.lpStructuredContext,
      [field]: value,
    };
    await updateLpContext.mutateAsync({ structured: next });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-2 text-slate-500 text-sm">
        <Loader2 size={16} className="animate-spin text-violet-500" />
        プロジェクト情報を読み込み中です…
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-100 p-4 mb-6 flex items-center gap-2 text-red-700 text-sm">
        <AlertCircle size={16} className="shrink-0" />
        {error instanceof Error ? error.message : "プロジェクト情報の取得に失敗しました"}
      </div>
    );
  }

  const ctx = project.lpStructuredContext;

  return (
    <div className="mb-6 space-y-3">
      <h2 className="text-slate-900 mb-1" style={{ fontSize: "15px", fontWeight: 700 }}>
        LP分析コンテキスト
      </h2>
      <p className="text-slate-500 text-xs mb-2">
        LPから抽出した分析内容です。バナー生成時のコンテキストとして利用されます。気になる箇所があれば編集して保存してください。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <EditableSection
          label="コアバリュー"
          field="coreValue"
          value={ctx.coreValue}
          placeholder="例: 「忙しくても続けられる、ストレスフリーなダイエット習慣」など"
          onSave={handleSaveField}
        />
        <EditableSection
          label="メインターゲット"
          field="mainTarget"
          value={ctx.mainTarget}
          placeholder="例: 30〜40代の仕事と家事で忙しい女性 など"
          onSave={handleSaveField}
        />
        <EditableSection
          label="競合優位性"
          field="competitiveAdvantage"
          value={ctx.competitiveAdvantage}
          placeholder="例: 臨床試験データ / 定期縛りなし など"
          onSave={handleSaveField}
        />
      </div>
    </div>
  );
};

