import { useState, useRef, useEffect } from "react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Edit3, Check, ImagePlus, ShieldCheck, Trash2 } from "lucide-react";
import { generationsAtom } from "./stores";
import { GenerationRoundCard } from "./components/GenerationRoundCard";
import { PurchaseModal } from "./components/PurchaseModal";
import { PreviewModal } from "./components/PreviewModal";
import { LpContextPanel } from "./components/LpContextPanel";
import { RefBannerUploadModal } from "./components/RefBannerUploadModal";
import { DeleteProjectModal } from "./components/DeleteProjectModal";
import { useProject, useUpdateProjectName, useDeleteProject } from "./api";

export const ProjectDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.id ?? "demo-project";
  const { data: project, isLoading, isError } = useProject(projectId);
  const updateName = useUpdateProjectName(projectId);
  const deleteProject = useDeleteProject(projectId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const generations = useAtomValue(generationsAtom);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const prevGenerationsLengthRef = useRef(generations.length);

  useEffect(() => {
    if (generations.length > prevGenerationsLengthRef.current) {
      historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevGenerationsLengthRef.current = generations.length;
  }, [generations.length]);

  const totalPurchased = generations.reduce(
    (acc, r) => acc + r.banners.filter((b) => b.isPurchased).length,
    0
  );

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
    <div className="min-h-full bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-20 shrink-0 min-h-16">
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
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="プロジェクトを削除"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <div className="sticky top-16 z-10 shrink-0 bg-gray-50 max-h-[60vh] overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <LpContextPanel />
        </div>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900" style={{ fontSize: "17px", fontWeight: 700 }}>
            生成結果
          </h2>
          {totalPurchased > 0 && (
            <p className="text-slate-500" style={{ fontSize: "13px" }}>
              <span className="text-emerald-600 font-medium">{totalPurchased}本購入済み</span>
            </p>
          )}
        </div>

        <div className="space-y-8">
          {generations.map((round) => (
            <GenerationRoundCard key={round.id} round={round} />
          ))}
          <div ref={historyEndRef} aria-hidden />
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 mb-6">
          <ShieldCheck size={16} className="text-slate-400 shrink-0" />
          <p className="text-slate-400" style={{ fontSize: "12px", lineHeight: 1.5 }}>
            購入後は透かし(ウォーターマーク)なしの高解像度バナー画像をダウンロードできます。生成AIによる画像のため、実際の配信前にクリエイティブポリシーをご確認ください。
          </p>
        </div>

      </div>

      <footer className="fixed bottom-0 left-60 right-0 z-10 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 py-3 font-medium transition-colors"
            style={{ fontSize: "14px" }}
          >
            <ImagePlus size={18} />参考バナーをアップロードして生成
          </button>
        </div>
      </footer>

      <RefBannerUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <DeleteProjectModal
        isOpen={deleteModalOpen}
        projectName={project?.name ?? "プロジェクト"}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          deleteProject.mutate(undefined, {
            onSuccess: () => {
              setDeleteModalOpen(false);
              navigate("/");
            },
          });
        }}
        isDeleting={deleteProject.isPending}
      />
      <PurchaseModal />
      <PreviewModal />
    </div>
  );
};
