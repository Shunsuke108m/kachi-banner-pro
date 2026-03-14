import { useState } from "react";
import { useAtom } from "jotai";
import { Edit3, Save, Loader2, AlertCircle, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { type LpStructuredContext, useProject, useUpdateLpContext } from "../api";
import { useParams } from "react-router";
import { lpContextOpenAtom } from "../stores";

type SimpleSectionKey = keyof Pick<
  LpStructuredContext,
  "coreValue" | "mainTarget" | "competitiveAdvantage"
>;

type ListSectionKey = keyof Pick<
  LpStructuredContext,
  "functionalBenefits" | "emotionalBenefits"
>;

interface EditableSectionProps {
  label: string;
  placeholder: string;
  field: SimpleSectionKey;
  value: string;
  onSave: (field: SimpleSectionKey, value: string) => Promise<void>;
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

interface EditableListSectionProps {
  label: string;
  placeholder: string;
  field: ListSectionKey;
  values: string[];
  onSave: (field: ListSectionKey, values: string[]) => Promise<void>;
}

const EditableListSection = ({ label, placeholder, field, values, onSave }: EditableListSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(values.join("\n"));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const next = draft
        .split(/\r?\n/)
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
      await onSave(field, next);
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

export const LpContextPanel = () => {
  const params = useParams();
  const projectId = params.id ?? "demo-project";
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const updateLpContext = useUpdateLpContext(projectId);

  const handleSaveField = async (field: SimpleSectionKey, value: string) => {
    if (!project) return;
    const next: LpStructuredContext = {
      ...project.lpStructuredContext,
      [field]: value,
    };
    await updateLpContext.mutateAsync({ structured: next });
  };

  const handleSaveList = async (field: ListSectionKey, values: string[]) => {
    if (!project) return;
    const next: LpStructuredContext = {
      ...project.lpStructuredContext,
      [field]: values,
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
  const [open, setOpen] = useAtom(lpContextOpenAtom);

  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/80 transition-colors"
      >
        <h2 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 700 }}>
          LP分析コンテキスト
        </h2>
        {open ? (
          <ChevronDown size={20} className="text-slate-400 shrink-0" aria-hidden />
        ) : (
          <ChevronRight size={20} className="text-slate-400 shrink-0" aria-hidden />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-gray-100">
          <p className="text-slate-500 text-xs pt-3">
            LPから抽出した分析内容です。バナー生成時のコンテキストとして利用されます。気になる箇所があれば編集して保存してください。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <EditableSection
              label="コアバリュー"
              field="coreValue"
              value={ctx.coreValue}
              placeholder="例: コアバリュー（一言で言うと何を変える商品か）"
              onSave={handleSaveField}
            />
            <EditableSection
              label="メインターゲット"
              field="mainTarget"
              value={ctx.mainTarget}
              placeholder="例: ターゲット層（誰がメインの顧客になり得るか）"
              onSave={handleSaveField}
            />
            <EditableSection
              label="競合優位性"
              field="competitiveAdvantage"
              value={ctx.competitiveAdvantage}
              placeholder="例: 差別化ポイント（なぜ他ではなくこれを選ぶべきか）"
              onSave={handleSaveField}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EditableListSection
              label="機能的ベネフィット（スペック・事実）"
              field="functionalBenefits"
              values={ctx.functionalBenefits}
              placeholder="例: 1行1項目でスペック・事実を入力"
              onSave={handleSaveList}
            />
            <EditableListSection
              label="情緒的ベネフィット（得られる安心感や優越感）"
              field="emotionalBenefits"
              values={ctx.emotionalBenefits}
              placeholder="例: 1行1項目で得られる安心感・優越感を入力"
              onSave={handleSaveList}
            />
          </div>
          <div className="pt-4 mt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-gray-50 rounded-lg transition-colors"
              style={{ fontSize: "13px" }}
            >
              <ChevronUp size={16} />閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

