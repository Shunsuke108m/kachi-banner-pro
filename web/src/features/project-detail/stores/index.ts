import { atom } from "jotai";
import { type GeneratedBanner } from "../types";
import { MOCK_BANNERS } from "../utils/mock-data";

export const bannersAtom = atom<GeneratedBanner[]>(MOCK_BANNERS);
export const purchaseTargetAtom = atom<GeneratedBanner | null>(null);
export const expandedAnalysisAtom = atom<string | null>(null);
export const previewBannerAtom = atom<GeneratedBanner | null>(null);
export const purchaseCompleteAtom = atom(false);
