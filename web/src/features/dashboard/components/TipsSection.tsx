import { BarChart2 } from "lucide-react";

export const TipsSection = () => (
  <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-5">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
        <BarChart2 size={16} className="text-amber-600" />
      </div>
      <div>
        <h3 className="text-amber-800" style={{ fontSize: "14px", fontWeight: 600 }}>効果を最大化するコツ</h3>
        <p className="text-amber-700 mt-1" style={{ fontSize: "13px", lineHeight: 1.6 }}>
          Facebook広告ライブラリやMeta広告ライブラリで「いいね数が多い」「長期間掲載されている」バナーを参考にアップロードすると、より高CTR・高CVRのバナーが生成されます。競合や類似商材のバナーを積極的に活用しましょう。
        </p>
      </div>
    </div>
  </div>
);
