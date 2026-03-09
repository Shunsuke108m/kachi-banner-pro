import { MAX_LP_URL_LENGTH, LP_HTML_SLICE, LP_FETCH_TIMEOUT_MS } from "../config.js";

const URL_REGEX = /^https?:\/\/[^\s]+$/i;

export function isUrl(input: string): boolean {
  const trimmed = input.trim();
  return trimmed.length <= MAX_LP_URL_LENGTH && URL_REGEX.test(trimmed);
}

/**
 * LP入力（URL）から分析用コンテンツを取得する。
 * - URL: fetch で HTML を取得し、先頭 N 文字をそのまま LLM に渡す（LLM に解釈させる）
 */
export async function getLpContent(lpInput: string, fetchImpl: typeof fetch): Promise<{ content: string; error?: string }> {
  const trimmed = lpInput.trim();
  if (!trimmed) {
    return { content: "", error: "lpInput is required" };
  }

  if (isUrl(trimmed)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), LP_FETCH_TIMEOUT_MS);
      const res = await fetchImpl(trimmed, {
        signal: controller.signal,
        headers: {
          "User-Agent": "KachiBannerPro/1.0 (LP Analysis)",
        },
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        return { content: "", error: `LPにアクセスできませんでした (${res.status})` };
      }
      const html = await res.text();
      const content = html.slice(0, LP_HTML_SLICE);
      return { content };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      if (message.includes("abort") || message.includes("timeout")) {
        return { content: "", error: "LPの取得がタイムアウトしました" };
      }
      return { content: "", error: "LPにアクセスできませんでした" };
    }
  }
  return { content: "", error: "有効なLPのURLを入力してください" };
}
