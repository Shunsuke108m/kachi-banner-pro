import { atom } from "jotai";
import { type Step, type LPAnalysis, type LpStructuredContext } from "../types";
import { DEFAULT_ANALYSIS } from "../utils/constants";
import { EMPTY_STRUCTURED_CONTEXT } from "@shared";

export const currentStepAtom = atom<Step>(1);
export const lpUrlAtom = atom("");
export const analysisCompleteAtom = atom(false);
/** API が返した LP 分析結果（Markdown）。Step2 で表示・編集する元データ */
export const lpAnalysisMarkdownAtom = atom<string>("");
/** 構造化されたLP分析結果。項目ごとに編集される */
export const lpStructuredContextAtom = atom<LpStructuredContext>(EMPTY_STRUCTURED_CONTEXT);
export const lpAnalysisAtom = atom<LPAnalysis>();
export const uploadedBannersAtom = atom<string[]>([]);
