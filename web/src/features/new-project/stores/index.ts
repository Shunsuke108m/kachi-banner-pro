import { atom } from "jotai";
import { type Step, type LPAnalysis } from "../types";
import { DEFAULT_ANALYSIS } from "../utils/constants";

export const currentStepAtom = atom<Step>(1);
export const lpUrlAtom = atom("");
export const analysisCompleteAtom = atom(false);
/** API が返した LP 分析結果（Markdown）。Step2 で表示・編集する */
export const lpAnalysisMarkdownAtom = atom<string>("");
export const lpAnalysisAtom = atom<LPAnalysis>(DEFAULT_ANALYSIS);
export const uploadedBannersAtom = atom<string[]>([]);
