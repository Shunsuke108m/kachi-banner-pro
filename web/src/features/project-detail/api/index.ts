import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiBaseUrl } from "../../new-project/api/config";

// ------- プロジェクト一覧（サイドバー用。id と name のみ） -------

export interface ProjectListItem {
  id: string;
  name: string;
}

async function fetchProjectList(): Promise<ProjectListItem[]> {
  const res = await fetch(`${getApiBaseUrl()}/projects`);
  const data = (await res.json()) as { ok: boolean; projects?: ProjectListItem[]; error?: string };
  if (!data.ok || !data.projects) {
    return [];
  }
  return data.projects;
}

export const useProjectList = () =>
  useQuery({
    queryKey: ["projectList"],
    queryFn: fetchProjectList,
  });

// ------- バナー購入（既存のモック） -------

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const purchaseBanner = async (_bannerId: string) => {
  await delay(2000);
};

export const usePurchaseBanner = () => useMutation({ mutationFn: purchaseBanner });

// ------- プロジェクト / LPコンテキスト --------
// スキーマは shared に一元化（プロンプト変更時は shared のみ修正）
import type { LpStructuredContext } from "@shared";
export type { LpStructuredContext };

export interface Project {
  id: string;
  userId: string;
  name: string;
  lpUrl: string;
  lpRawAnalysisMarkdown: string;
  lpStructuredContext: LpStructuredContext;
}

interface GetProjectResponse {
  ok: boolean;
  project?: Project;
  error?: string;
}

interface UpdateLpContextResponse {
  ok: boolean;
  lpStructuredContext: LpStructuredContext;
}

const DEMO_PROJECT_ID = "demo-project";

async function fetchProject(projectId: string): Promise<Project> {
  const res = await fetch(`${getApiBaseUrl()}/project/${projectId}`);
  const data = (await res.json()) as GetProjectResponse;
  if (!data.ok || !data.project) {
    throw new Error(data.error ?? "プロジェクトの取得に失敗しました");
  }
  return data.project;
}

export const useProject = (projectId?: string) => {
  const id = projectId ?? DEMO_PROJECT_ID;
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
  });
};

async function updateProjectName(projectId: string, name: string): Promise<Project> {
  const res = await fetch(`${getApiBaseUrl()}/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim() || "無題のプロジェクト" }),
  });
  const data = (await res.json()) as GetProjectResponse & { error?: string };
  if (!data.ok || !data.project) {
    throw new Error(data.error ?? "プロジェクト名の更新に失敗しました");
  }
  return data.project;
}

export const useUpdateProjectName = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => updateProjectName(projectId, name),
    onSuccess: (updated) => {
      queryClient.setQueryData(["project", projectId], updated);
      queryClient.invalidateQueries({ queryKey: ["projectList"] });
    },
  });
};

interface UpdateLpContextArgs {
  projectId?: string;
  structured: LpStructuredContext;
  markdown?: string;
}

async function updateLpContext(args: UpdateLpContextArgs): Promise<LpStructuredContext> {
  const projectId = args.projectId ?? DEMO_PROJECT_ID;
  const res = await fetch(`${getApiBaseUrl()}/project/${projectId}/lp-context`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structured: args.structured, markdown: args.markdown }),
  });
  const data = (await res.json()) as UpdateLpContextResponse & { error?: string };
  if (!data.ok) {
    throw new Error(data.error ?? "LPコンテキストの更新に失敗しました");
  }
  return data.lpStructuredContext;
}

export const useUpdateLpContext = (projectId?: string) => {
  const queryClient = useQueryClient();
  const id = projectId ?? DEMO_PROJECT_ID;

  return useMutation({
    mutationFn: (args: Omit<UpdateLpContextArgs, "projectId">) =>
      updateLpContext({ projectId: id, ...args }),
    onSuccess: (lpStructuredContext) => {
      queryClient.setQueryData<Project | undefined>(["project", id], (prev) =>
        prev ? { ...prev, lpStructuredContext } : prev
      );
    },
  });
};
