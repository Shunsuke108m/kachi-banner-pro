import { useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck, Edit3, Check } from "lucide-react";
import { bannersAtom } from "./stores";
import { AnalysisSummary } from "./components/AnalysisSummary";
import { BannerCard } from "./components/BannerCard";
import { PurchaseModal } from "./components/PurchaseModal";
import { PreviewModal } from "./components/PreviewModal";
import { LpContextPanel } from "./components/LpContextPanel";
import { useProject, useUpdateProjectName } from "./api";

export const ProjectDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.id ?? "demo-project";
  const { data: project, isLoading, isError } = useProject(projectId);
  const updateName = useUpdateProjectName(projectId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const banners = useAtomValue(bannersAtom);
  const purchasedCount = banners.filter((b) => b.isPurchased).length;

  const startEditName = () => {
    setNameDraft(project?.name ?? "");
    setIsEditingName(true);
  };
  const saveName = () => {
    if (nameDraft.trim()) {
      updateName.mutate(nameDraft, { onSettled: () => setIsEditingName(false) });
    } else {
      setIsEditingName(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <p className="text-slate-500">読み込み中…</p>
      </div>
    );
  }
  if (isError || !project) {
    return (
      <div className="min-h-full bg-gray-50 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-slate-600">プロジェクトが見つかりません</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            ダッシュボードへ
          </button>
          <button
            onClick={() => navigate("/new")}
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            新規プロジェクトを作成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors"
              style={{ fontSize: "13px" }}
            >
              <ArrowLeft size={15} />ダッシュボード
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveName()}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-slate-800"
                    style={{ fontSize: "15px", fontWeight: 600 }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={saveName}
                    disabled={updateName.isPending}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    <Check size={14} />保存
                  </button>
                  <button type="button" onClick={() => setIsEditingName(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                    キャンセル
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-slate-800 truncate" style={{ fontSize: "15px", fontWeight: 600 }}>
                    {project?.name ?? "プロジェクト"}
                  </h1>
                  <button
                    type="button"
                    onClick={startEditName}
                    className="text-slate-400 hover:text-violet-600 p-0.5"
                    aria-label="プロジェクト名を編集"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
              {project?.lpUrl && !isEditingName && (
                <p className="text-slate-400 truncate" style={{ fontSize: "11px" }}>
                  LP: {project.lpUrl}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <CheckCircle2 size={13} />
              <span style={{ fontSize: "12px", fontWeight: 500 }}>3パターン生成完了</span>
            </div>
            <button
              onClick={() => navigate("/new")}
              className="flex items-center gap-1.5 border border-violet-200 text-violet-600 hover:bg-violet-50 rounded-lg px-3 py-1.5 transition-colors"
              style={{ fontSize: "13px" }}
            >
              <RefreshCw size={13} />再生成
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <LpContextPanel />
        <AnalysisSummary />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900" style={{ fontSize: "17px", fontWeight: 700 }}>
            生成されたバナー <span className="text-violet-600">3パターン</span>
          </h2>
          <p className="text-slate-500" style={{ fontSize: "13px" }}>
            {purchasedCount > 0
              ? <span className="text-emerald-600 font-medium">{purchasedCount}本購入済み</span>
              : "気に入ったバナーを ¥500 で購入"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {banners.map((banner) => <BannerCard key={banner.id} banner={banner} />)}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <ShieldCheck size={16} className="text-slate-400 shrink-0" />
          <p className="text-slate-400" style={{ fontSize: "12px", lineHeight: 1.5 }}>
            購入後は透かし(ウォーターマーク)なしの高解像度バナー画像をダウンロードできます。生成AIによる画像のため、実際の配信前にクリエイティブポリシーをご確認ください。
          </p>
        </div>
      </div>

      <PurchaseModal />
      <PreviewModal />
    </div>
  );
};
