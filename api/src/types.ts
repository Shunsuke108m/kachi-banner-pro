// ========== LP 分析リクエスト/レスポンス ==========

export interface LpAnalysisRequest {
  lpInput: string;
}

export interface LpAnalysisSuccessResponse {
  ok: true;
  markdown: string;
}

export interface LpAnalysisErrorResponse {
  ok: false;
  error: string;
}

export type LpAnalysisResponse = LpAnalysisSuccessResponse | LpAnalysisErrorResponse;

// ========== LP 分析結果の構造化コンテキスト ==========
// 型定義は shared を参照（プロンプト変更時は shared のみ修正すればよい）
import type { LpStructuredContext } from "../../shared/lp-analysis.js";

// ========== プロジェクト ==========

export interface Project {
  id: string;
  userId: string;
  name: string;
  lpUrl: string;
  lpRawAnalysisMarkdown: string;
  lpStructuredContext: LpStructuredContext;
}

export interface GetProjectResponse {
  ok: true;
  project: Project;
}

export interface UpdateLpContextRequest {
  structured: LpStructuredContext;
  markdown?: string;
}

export interface UpdateLpContextResponse {
  ok: true;
  lpStructuredContext: LpStructuredContext;
  lpRawAnalysisMarkdown?: string;
}
