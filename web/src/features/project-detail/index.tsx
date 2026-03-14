import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import { bannersAtom } from "./stores";
import { AnalysisSummary } from "./components/AnalysisSummary";
import { BannerCard } from "./components/BannerCard";
import { PurchaseModal } from "./components/PurchaseModal";
import { PreviewModal } from "./components/PreviewModal";
import { LpContextPanel } from "./components/LpContextPanel";
import { useProject } from "./api";

export const ProjectDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.id ?? "demo-project";
  const { data: project } = useProject(projectId);
  const banners = useAtomValue(bannersAtom);
  const purchasedCount = banners.filter((b) => b.isPurchased).length;

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
            <div>
              <h1 className="text-slate-800" style={{ fontSize: "15px", fontWeight: 600 }}>
                {project?.name ?? "プロジェクト"}
              </h1>
              {project?.lpUrl && (
                <p className="text-slate-400" style={{ fontSize: "11px" }}>
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
