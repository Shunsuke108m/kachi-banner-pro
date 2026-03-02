import { useAtom, useSetAtom } from "jotai";
import { Lock, Unlock, Star, ZoomIn, Download, BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import { expandedAnalysisAtom, previewBannerAtom, purchaseTargetAtom } from "../stores";
import { BannerAnalysisDetail } from "./BannerAnalysisDetail";
import { type GeneratedBanner } from "../types";

interface Props {
  banner: GeneratedBanner;
}

const WatermarkOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div
      className="text-white/40 select-none pointer-events-none"
      style={{ fontSize: "28px", fontWeight: 700, transform: "rotate(-25deg)", letterSpacing: "8px" }}
    >
      SAMPLE
    </div>
  </div>
);

export const BannerCard = ({ banner }: Props) => {
  const [expandedAnalysis, setExpandedAnalysis] = useAtom(expandedAnalysisAtom);
  const setPreviewBanner = useSetAtom(previewBannerAtom);
  const setPurchaseTarget = useSetAtom(purchaseTargetAtom);

  const isExpanded = expandedAnalysis === banner.id;
  const toggleExpand = () => setExpandedAnalysis(isExpanded ? null : banner.id);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${banner.isPurchased ? "border-emerald-200" : "border-gray-100"}`}>
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className={`w-full h-full object-cover transition-all ${banner.isPurchased ? "" : "blur-sm brightness-75"}`}
        />
        {!banner.isPurchased && <WatermarkOverlay />}

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-slate-900/80 text-white rounded-lg px-2.5 py-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span style={{ fontSize: "12px", fontWeight: 600 }}>{banner.appealScore}</span>
        </div>

        {banner.isPurchased ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-emerald-500 text-white rounded-lg px-2.5 py-1">
            <Unlock size={11} /><span style={{ fontSize: "11px" }}>購入済み</span>
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-slate-900/70 rounded-lg flex items-center justify-center">
            <Lock size={13} className="text-white" />
          </div>
        )}

        <button
          onClick={() => setPreviewBanner(banner)}
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-slate-900/70 hover:bg-slate-900 text-white rounded-lg px-2.5 py-1.5 transition-colors"
          style={{ fontSize: "11px" }}
        >
          <ZoomIn size={11} />プレビュー
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-slate-800" style={{ fontSize: "14px", fontWeight: 600 }}>{banner.title}</h3>
            <span className="inline-block mt-1 text-violet-600 bg-violet-50 rounded-md px-2 py-0.5" style={{ fontSize: "11px" }}>
              {banner.appealType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-blue-50 rounded-lg p-2.5 text-center">
            <p className="text-blue-400" style={{ fontSize: "10px" }}>CTR予測</p>
            <p className="text-blue-700" style={{ fontSize: "16px", fontWeight: 700 }}>{banner.ctrPrediction}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
            <p className="text-emerald-400" style={{ fontSize: "10px" }}>CVR予測</p>
            <p className="text-emerald-700" style={{ fontSize: "16px", fontWeight: 700 }}>{banner.cvrPrediction}</p>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
          <button
            onClick={toggleExpand}
            className="w-full flex items-center justify-between p-3 text-slate-600 hover:bg-gray-50 transition-colors"
            style={{ fontSize: "12px" }}
          >
            <span className="flex items-center gap-1.5">
              <BarChart2 size={12} className="text-violet-400" />訴求力分析を見る
            </span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {isExpanded && <BannerAnalysisDetail analysis={banner.analysis} />}
        </div>

        {banner.isPurchased ? (
          <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2.5 transition-colors">
            <Download size={14} /><span style={{ fontSize: "13px" }}>高画質でダウンロード</span>
          </button>
        ) : (
          <button
            onClick={() => setPurchaseTarget(banner)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl py-2.5 transition-all shadow-md shadow-violet-200"
          >
            <Lock size={14} /><span style={{ fontSize: "13px" }}>¥500 で購入してダウンロード</span>
          </button>
        )}
      </div>
    </div>
  );
};
