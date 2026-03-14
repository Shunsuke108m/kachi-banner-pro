export type Step = 1 | 2 | 3;

export interface LPAnalysis {
  productName: string;
  category: string;
  targetAge: string;
  targetGender: string;
  targetIncome: string;
  targetJob: string;
  pains: string[];
  desires: string[];
  mainMessage: string;
  cta: string;
}

// api/web 共通。実体は shared にあり、プロンプト変更時は shared のみ修正する
export type { LpStructuredContext } from "@shared";
