import { Hono } from "hono";
import type { Env } from "../../index.js";
import { getLpContent } from "../../services/lp-analysis/lp-fetcher.js";
import { analyzeLpWithLlm } from "../../services/lp-analysis/llm.js";
import type { LpAnalysisResponse } from "../../types.js";
import { MAX_LP_INPUT_LENGTH, ENV_OPENAI_API_KEY } from "../../config.js";

export const lpAnalysisRoutes = new Hono<{ Bindings: Env }>().post("/lp-analysis", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json<LpAnalysisResponse>({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const parsed = body as Record<string, unknown>;
  const lpInput = typeof parsed?.lpInput === "string" ? parsed.lpInput : "";

  if (!lpInput.trim()) {
    return c.json<LpAnalysisResponse>({ ok: false, error: "lpInput is required" }, 400);
  }

  if (lpInput.length > MAX_LP_INPUT_LENGTH) {
    return c.json<LpAnalysisResponse>(
      { ok: false, error: `lpInput is too long (max ${MAX_LP_INPUT_LENGTH} characters)` },
      400
    );
  }

  const apiKey = c.env[ENV_OPENAI_API_KEY];
  if (!apiKey) {
    return c.json<LpAnalysisResponse>(
      { ok: false, error: "OPENAI_API_KEY is not configured" },
      500
    );
  }

  const { content, error: fetchError } = await getLpContent(lpInput, fetch);
  if (fetchError) {
    return c.json<LpAnalysisResponse>({ ok: false, error: fetchError }, 422);
  }

  const { markdown, error: llmError } = await analyzeLpWithLlm(content, apiKey, fetch);
  if (llmError) {
    return c.json<LpAnalysisResponse>({ ok: false, error: llmError }, 502);
  }

  return c.json<LpAnalysisResponse>({ ok: true, markdown });
});
