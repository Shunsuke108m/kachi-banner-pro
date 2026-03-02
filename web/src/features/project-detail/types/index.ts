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
