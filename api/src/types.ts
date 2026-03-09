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
