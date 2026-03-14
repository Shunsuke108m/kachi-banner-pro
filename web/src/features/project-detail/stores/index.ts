import { atom } from "jotai";
import { type GeneratedBanner, type GenerationRound } from "../types";
import { INITIAL_GENERATION_ROUND, createMockBannersForRound } from "../utils/mock-data";

/** 生成履歴（チャット型: 末尾が最新）。1ラウンド = 参考バナー1枚 + 生成3パターン */
export const generationsAtom = atom<GenerationRound[]>([INITIAL_GENERATION_ROUND]);

export const purchaseTargetAtom = atom<GeneratedBanner | null>(null);
export const expandedAnalysisAtom = atom<string | null>(null);
export const previewBannerAtom = atom<GeneratedBanner | null>(null);
export const purchaseCompleteAtom = atom(false);

/** LP分析コンテキストパネルの開閉状態（true = 開） */
export const lpContextOpenAtom = atom(true);

/** 新規ラウンドを末尾に追加（参考バナーは任意。モックで3パターン即時反映） */
export function addGenerationRound(
  setGenerations: (fn: (prev: GenerationRound[]) => GenerationRound[]) => void,
  referenceImageUrl?: string
) {
  const roundId = `r-${Date.now()}`;
  setGenerations((prev) => [
    ...prev,
    {
      id: roundId,
      generatedAt: new Date().toISOString(),
      referenceImageUrl,
      banners: createMockBannersForRound(roundId),
    },
  ]);
}

/** 指定バナーを購入済みに更新 */
export function markBannerPurchased(
  setGenerations: (fn: (prev: GenerationRound[]) => GenerationRound[]) => void,
  bannerId: string
) {
  setGenerations((prev) =>
    prev.map((round) => ({
      ...round,
      banners: round.banners.map((b) =>
        b.id === bannerId ? { ...b, isPurchased: true } : b
      ),
    }))
  );
}
