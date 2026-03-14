export interface BannerAnalysis {
  eyeCatch: string;
  readability: string;
  tapIncentive: string;
  cvrBoost: string;
}

export interface GeneratedBanner {
  id: string;
  title: string;
  appealType: string;
  appealScore: number;
  ctrPrediction: string;
  cvrPrediction: string;
  imageUrl: string;
  analysis: BannerAnalysis;
  isPurchased: boolean;
}

/** 1回の生成（分析結果＋参考バナー＋3パターン）。同時出力の1ユニット。末尾が最新。 */
export interface GenerationRound {
  id: string;
  /** 出力日時（ISO 8601） */
  generatedAt: string;
  referenceImageUrl?: string;
  banners: GeneratedBanner[];
}
