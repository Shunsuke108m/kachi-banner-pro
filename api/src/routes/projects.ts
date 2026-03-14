import { Hono } from "hono";
import type { Env } from "../index.js";
import type {
  GetProjectResponse,
  Project,
  UpdateLpContextRequest,
  UpdateLpContextResponse,
} from "../types.js";
import {
  EMPTY_STRUCTURED_CONTEXT,
  type LpStructuredContext,
} from "../../../shared/lp-analysis.js";

const DEMO_USER_ID = "demo-user";
const DEMO_PROJECT_ID = "demo-project";

// シンプルなインメモリ格納。Workers のインスタンスが生きている間のみ保持される。
let demoProject: Project = {
  id: DEMO_PROJECT_ID,
  userId: DEMO_USER_ID,
  name: "デモプロジェクト",
  lpUrl: "",
  lpRawAnalysisMarkdown: "",
  lpStructuredContext: { ...EMPTY_STRUCTURED_CONTEXT },
};

export const projectRoutes = new Hono<{ Bindings: Env }>()
  // プロジェクト取得（Phase1: どのIDに対してもデモプロジェクトを返す）
  .get("/projects/:projectId", (c) => {
    return c.json<GetProjectResponse>({ ok: true, project: demoProject });
  })
  // LPコンテキストの更新（Phase1: どのIDに対してもデモプロジェクトを更新）
  .put("/projects/:projectId/lp-context", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ ok: false, error: "Invalid JSON body" }, 400);
    }

    const { structured, markdown } = body as UpdateLpContextRequest;
    if (!structured) {
      return c.json({ ok: false, error: "structured context is required" }, 400);
    }

    demoProject = {
      ...demoProject,
      lpStructuredContext: structured,
      lpRawAnalysisMarkdown: markdown ?? demoProject.lpRawAnalysisMarkdown,
    };

    const res: UpdateLpContextResponse = {
      ok: true,
      lpStructuredContext: demoProject.lpStructuredContext,
      lpRawAnalysisMarkdown: markdown,
    };

    return c.json(res);
  });

