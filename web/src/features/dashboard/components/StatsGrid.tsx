import { Sparkles, Download, Wallet, TrendingUp } from "lucide-react";
import { STATS } from "../utils/mock-data";

const ICON_MAP = {
  violet: Sparkles,
  emerald: Download,
  amber: Wallet,
  blue: TrendingUp,
} as const;

const COLOR_MAP = {
  violet: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
} as const;

export const StatsGrid = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {STATS.map((stat) => {
      const Icon = ICON_MAP[stat.colorKey];
      const color = COLOR_MAP[stat.colorKey];
      return (
        <div key={stat.label} className={`bg-white rounded-2xl p-5 border ${color.border} shadow-sm`}>
          <div className={`w-9 h-9 ${color.bg} rounded-xl flex items-center justify-center mb-3`}>
            <Icon size={17} className={color.text} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-slate-900" style={{ fontSize: "24px", fontWeight: 700 }}>{stat.value}</span>
            <span className="text-slate-400" style={{ fontSize: "13px" }}>{stat.unit}</span>
          </div>
          <p className="text-slate-500 mt-0.5" style={{ fontSize: "12px" }}>{stat.label}</p>
        </div>
      );
    })}
  </div>
);
