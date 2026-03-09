import { LP_ANALYSIS_SYSTEM_PROMPT } from "../prompts/lp-analysis.js";
import { OPENAI_CHAT_URL, OPENAI_MODEL, OPENAI_MAX_TOKENS } from "../config.js";

export interface AnalyzeLpResult {
  markdown: string;
  error?: string;
}

/**
 * LPコンテンツを OpenAI で分析し、Markdown で返す。
 * Workers 対応のため fetch で直接呼び出し（SDK はバンドルサイズ節約のため未使用）。
 */
export async function analyzeLpWithLlm(
  content: string,
  apiKey: string,
  fetchImpl: typeof fetch
): Promise<AnalyzeLpResult> {
  if (!apiKey) {
    return { markdown: "", error: "OPENAI_API_KEY is not set" };
  }

  const userMessage =
    content.length > 0
      ? `以下がLPの内容です。指定フォーマットで分析結果をMarkdownで出力してください。\n\n---\n\n${content}`
      : "LPの内容が空です。入力されたURLにアクセスできなかった可能性があります。";

  const body = {
    model: OPENAI_MODEL,
    max_tokens: OPENAI_MAX_TOKENS,
    messages: [
      { role: "system" as const, content: LP_ANALYSIS_SYSTEM_PROMPT },
      { role: "user" as const, content: userMessage },
    ],
  };

  try {
    const res = await fetchImpl(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      if (res.status === 429) {
        return { markdown: "", error: "APIの利用制限に達しました。しばらく待って再試行してください。" };
      }
      return { markdown: "", error: `LLMエラー (${res.status}): ${errText.slice(0, 200)}` };
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    return { markdown: text };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { markdown: "", error: `LLM呼び出しに失敗しました: ${message}` };
  }
}
