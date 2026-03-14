import { atom } from "jotai";
import { type GeneratedBanner } from "../types";
import { MOCK_BANNERS } from "../utils/mock-data";

export const bannersAtom = atom<GeneratedBanner[]>(MOCK_BANNERS);
export const purchaseTargetAtom = atom<GeneratedBanner | null>(null);
export const expandedAnalysisAtom = atom<string | null>(null);
export const previewBannerAtom = atom<GeneratedBanner | null>(null);
export const purchaseCompleteAtom = atom(false);

/** LP分析コンテキストパネルの開閉状態（true = 開）。同時に閲覧するプロジェクトは1つのため単一で保持。 */
export const lpContextOpenAtom = atom(true);
