import { Clock } from "lucide-react";
import type { GenerationRound } from "../types";
import { AnalysisSummary } from "./AnalysisSummary";
import { BannerCard } from "./BannerCard";

function formatGeneratedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface GenerationRoundCardProps {
  round: GenerationRound;
}

/** 1回の生成を1ユニットで表示（出力日時・分析結果・参考画像・3バナー） */
export const GenerationRoundCard = ({ round }: GenerationRoundCardProps) => (
  <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
      <Clock size={14} className="text-slate-400 shrink-0" />
      <time dateTime={round.generatedAt} className="text-slate-600" style={{ fontSize: "13px", fontWeight: 500 }}>
        {formatGeneratedAt(round.generatedAt)} に出力
      </time>
    </div>
    <div className="p-5 space-y-5">
      <div>
        <h3 className="text-slate-700 mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
          参考バナー分析サマリー
        </h3>
        <AnalysisSummary embedded />
      </div>
      {round.referenceImageUrl && (
        <div>
          <p className="text-slate-500 mb-2" style={{ fontSize: "12px" }}>
            参考バナー
          </p>
          <img
            src={round.referenceImageUrl}
            alt="参考"
            className="rounded-xl border border-gray-100 max-h-24 object-contain bg-gray-50"
          />
        </div>
      )}
      <div>
        <h3 className="text-slate-700 mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
          生成された3パターン
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {round.banners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
