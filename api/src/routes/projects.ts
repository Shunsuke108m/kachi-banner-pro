import { Hono } from "hono";
import type { Env } from "../index.js";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectResponse,
  ListProjectsResponse,
  Project,
  ProjectListItem,
  UpdateLpContextRequest,
  UpdateLpContextResponse,
  UpdateProjectRequest,
} from "../types.js";
import {
  EMPTY_STRUCTURED_CONTEXT,
  type LpStructuredContext,
} from "../../../shared/lp-analysis.js";

const DEMO_USER_ID = "demo-user";

/** インメモリストア。Workers のインスタンスが生きている間のみ保持。key = projectId */
const store = new Map<string, Project>();

function nextId(): string {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const projectRoutes = new Hono<{ Bindings: Env }>()
  // 一覧（サイドバー用。id と name のみで軽量）
  .get("/projects", (c) => {
    const items: ProjectListItem[] = [];
    for (const p of store.values()) {
      if (p.userId === DEMO_USER_ID) items.push({ id: p.id, name: p.name });
    }
    items.sort((a, b) => b.id.localeCompare(a.id)); // 新しい順
    return c.json<ListProjectsResponse>({ ok: true, projects: items });
  })
  // 詳細取得（full Project）
  .get("/project/:projectId", (c) => {
    const projectId = c.req.param("projectId");
    const project = store.get(projectId);
    if (!project) {
      return c.json({ ok: false, error: "Project not found" }, 404);
    }
    return c.json<GetProjectResponse>({ ok: true, project });
  })
  // 新規作成（LP 分析完了時に呼ぶ）
  .post("/project", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ ok: false, error: "Invalid JSON body" }, 400);
    }
    const { name, lpUrl, lpStructuredContext, lpRawAnalysisMarkdown } =
      body as CreateProjectRequest;
    if (
      typeof name !== "string" ||
      typeof lpUrl !== "string" ||
      !lpStructuredContext
    ) {
      return c.json(
        { ok: false, error: "name, lpUrl, lpStructuredContext are required" },
        400
      );
    }
    const id = nextId();
    const project: Project = {
      id,
      userId: DEMO_USER_ID,
      name: name.trim() || "無題のプロジェクト",
      lpUrl: lpUrl.trim(),
      lpRawAnalysisMarkdown: lpRawAnalysisMarkdown ?? "",
      lpStructuredContext: lpStructuredContext ?? { ...EMPTY_STRUCTURED_CONTEXT },
    };
    store.set(id, project);
    return c.json<CreateProjectResponse>({ ok: true, project }, 201);
  })
  // プロジェクト名など更新
  .patch("/project/:projectId", async (c) => {
    const projectId = c.req.param("projectId");
    const project = store.get(projectId);
    if (!project) {
      return c.json({ ok: false, error: "Project not found" }, 404);
    }
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ ok: false, error: "Invalid JSON body" }, 400);
    }
    const { name } = body as UpdateProjectRequest;
    if (typeof name === "string") {
      project.name = name.trim() || project.name;
      store.set(projectId, project);
    }
    return c.json<GetProjectResponse>({ ok: true, project });
  })
  // LP コンテキスト更新
  .put("/project/:projectId/lp-context", async (c) => {
    const projectId = c.req.param("projectId");
    const project = store.get(projectId);
    if (!project) {
      return c.json({ ok: false, error: "Project not found" }, 404);
    }
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

    project.lpStructuredContext = structured;
    if (markdown !== undefined) project.lpRawAnalysisMarkdown = markdown;
    store.set(projectId, project);

    const res: UpdateLpContextResponse = {
      ok: true,
      lpStructuredContext: project.lpStructuredContext,
      lpRawAnalysisMarkdown: project.lpRawAnalysisMarkdown,
    };
    return c.json(res);
  });
