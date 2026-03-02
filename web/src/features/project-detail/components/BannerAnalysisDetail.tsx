import { Eye, TrendingUp, MousePointerClick, Zap } from "lucide-react";
import { type BannerAnalysis } from "../types";

interface Props {
  analysis: BannerAnalysis;
}

const ANALYSIS_ROWS = [
  { key: "eyeCatch" as const, label: "アイキャッチ", icon: Eye, color: "text-blue-500" },
  { key: "readability" as const, label: "読ませる工夫", icon: TrendingUp, color: "text-emerald-500" },
  { key: "tapIncentive" as const, label: "タップ促進", icon: MousePointerClick, color: "text-amber-500" },
  { key: "cvrBoost" as const, label: "CVR向上", icon: Zap, color: "text-purple-500" },
];

export const BannerAnalysisDetail = ({ analysis }: Props) => (
  <div className="border-t border-gray-100 p-3 space-y-2.5">
    {ANALYSIS_ROWS.map((row) => (
      <div key={row.key}>
        <div className="flex items-center gap-1 mb-0.5">
          <row.icon size={11} className={row.color} />
          <span className="text-slate-500" style={{ fontSize: "10px", fontWeight: 600 }}>{row.label}</span>
        </div>
        <p className="text-slate-600 pl-4" style={{ fontSize: "11px", lineHeight: 1.5 }}>{analysis[row.key]}</p>
      </div>
    ))}
  </div>
);
