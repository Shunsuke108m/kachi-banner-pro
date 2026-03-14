export { EMPTY_STRUCTURED_CONTEXT } from "@shared";
import { type LPAnalysis } from "../types";

export const DEFAULT_ANALYSIS: LPAnalysis = {
  productName: "スリムエース（ダイエットサプリ）",
  category: "ダイエット・美容",
  targetAge: "30〜45歳",
  targetGender: "女性",
  targetIncome: "年収400〜600万円",
  targetJob: "会社員・主婦",
  pains: [
    "運動する時間がなく体重が増え続けている",
    "食事制限をしても効果が出ない",
    "産後に体型が戻らない",
    "夏までに痩せたいが方法がわからない",
  ],
  desires: [
    "3ヶ月で-5kg達成したい",
    "無理な食事制限なく痩せたい",
    "リバウンドしない体型を手に入れたい",
    "着たい服が着られる自分になりたい",
  ],
  mainMessage: "飲むだけ30日で-5kg。継続率92%の本格ダイエットサプリ",
  cta: "今すぐ無料お試しを申し込む",
};

export const DEMO_BANNER_URL =
  "https://images.unsplash.com/photo-1760405253566-bad204017cc3?w=400&q=80";

export const DEMO_LP_URLS = [
  "https://slim-ace.example.com",
  "https://beauty-lp.example.com",
] as const;
