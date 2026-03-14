import { MAX_LP_URL_LENGTH, LP_HTML_SLICE, LP_FETCH_TIMEOUT_MS } from "../config.js";

const URL_REGEX = /^https?:\/\/[^\s]+$/i;

export function isUrl(input: string): boolean {
  const trimmed = input.trim();
  return trimmed.length <= MAX_LP_URL_LENGTH && URL_REGEX.test(trimmed);
}

const JAPANESE_CHAR_REGEX = /[\u3040-\u30FF\u4E00-\u9FFF]/;
const IMPORTANT_KEYWORDS = [
  "FAQ",
  "よくある質問",
  "Q.",
  "料金",
  "価格",
  "無料",
  "プラン",
  "キャンペーン",
  "特典",
  "注意事項",
  "免責",
  "返金",
  "返品",
  "解約",
  "利用規約",
  "条件",
];

const decodeHtmlEntities = (text: string): string =>
  text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

/**
 * HTMLからLP分析に有用なテキストを抽出し、重要そうな情報を前方に集約する。
 * - script/style/head を除去
 * - 日本語を含まないテキストは優先度を下げる
 * - 料金/注意事項/FAQ などのキーワードを含むスニペットを優先的に先頭に配置
 */
const extractRelevantTextFromHtml = (html: string): string => {
  // 明らかに不要なタグの中身を削除
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  // プレーンテキスト化
  cleaned = cleaned.replace(/<[^>]+>/g, " ");
  cleaned = decodeHtmlEntities(cleaned);

  // ざっくり行単位に分割
  const roughLines = cleaned
    .split(/[\r\n]+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 0);

  const japaneseLines: string[] = [];
  const otherLines: string[] = [];

  for (const line of roughLines) {
    if (JAPANESE_CHAR_REGEX.test(line)) {
      japaneseLines.push(line);
    } else {
      otherLines.push(line);
    }
  }

  // キーワードを含む重要スニペットを抽出
  const importantSnippets: string[] = [];
  const used = new Set<string>();

  const allLines = [...japaneseLines, ...otherLines];
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    if (!JAPANESE_CHAR_REGEX.test(line)) continue;
    if (!IMPORTANT_KEYWORDS.some((kw) => line.includes(kw))) continue;

    const context = [allLines[i - 1], line, allLines[i + 1]]
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .join(" ");
    const snippet = context.trim();
    if (!snippet || used.has(snippet)) continue;
    used.add(snippet);
    importantSnippets.push(snippet);
  }

  const sections: string[] = [];

  if (japaneseLines.length > 0) {
    const header = japaneseLines.slice(0, 30).join("\n");
    sections.push("【LP上部の概要（抜粋）】", header);
  }

  if (importantSnippets.length > 0) {
    sections.push("【料金・FAQ・注意事項などの重要情報（抜粋）】", importantSnippets.join("\n"));
  }

  const remaining = japaneseLines.slice(30).join("\n");
  if (remaining) {
    sections.push("【その他本文（抜粋）】", remaining);
  }

  const assembled = sections.join("\n\n");
  return assembled;
};

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
      const extracted = extractRelevantTextFromHtml(html);
      const content = extracted.length > LP_HTML_SLICE ? extracted.slice(0, LP_HTML_SLICE) : extracted;
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
