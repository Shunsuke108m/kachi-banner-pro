import { BarChart2, Eye, TrendingUp, MousePointerClick, Zap } from "lucide-react";

const SUMMARY_ITEMS = [
  { label: "アイキャッチ工夫", value: "高コントラスト配色・ビフォーアフター", icon: Eye, color: "text-blue-500" },
  { label: "読ませる工夫", value: "短文コピー・感情共鳴フロー", icon: TrendingUp, color: "text-emerald-500" },
  { label: "タップ促進", value: "緊急性CTA・希少性", icon: MousePointerClick, color: "text-amber-500" },
  { label: "CVR向上", value: "社会的証明・リスク解消", icon: Zap, color: "text-purple-500" },
] as const;

export const AnalysisSummary = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
        <BarChart2 size={17} className="text-violet-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-slate-800" style={{ fontSize: "15px", fontWeight: 600 }}>参考バナー分析サマリー</h2>
        <p className="text-slate-500 mt-1" style={{ fontSize: "13px" }}>
          アップロードされた参考バナーから以下の訴求力要素を抽出し、3パターンに横展開しました。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {SUMMARY_ITEMS.map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <item.icon size={13} className={item.color} />
                <span className="text-slate-500" style={{ fontSize: "11px" }}>{item.label}</span>
              </div>
              <p className="text-slate-700" style={{ fontSize: "12px", fontWeight: 500 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
