import { useMutation } from "@tanstack/react-query";
import { getApiBaseUrl } from "./config";
import type { LpStructuredContext } from "@shared";

export interface LpAnalysisResult {
  markdown: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  lpUrl: string;
  lpRawAnalysisMarkdown: string;
  lpStructuredContext: LpStructuredContext;
}

export interface CreateProjectResult {
  project: Project;
}

async function createProject(args: {
  name: string;
  lpUrl: string;
  lpStructuredContext: LpStructuredContext;
  lpRawAnalysisMarkdown?: string;
}): Promise<CreateProjectResult> {
  const res = await fetch(`${getApiBaseUrl()}/project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: args.name.trim() || "無題のプロジェクト",
      lpUrl: args.lpUrl.trim(),
      lpStructuredContext: args.lpStructuredContext,
      lpRawAnalysisMarkdown: args.lpRawAnalysisMarkdown ?? "",
    }),
  });
  const data = (await res.json()) as { ok: boolean; project?: Project; error?: string };
  if (!data.ok || !data.project) {
    throw new Error(data.error ?? "プロジェクトの作成に失敗しました");
  }
  return { project: data.project };
}

export const useCreateProject = () => useMutation({ mutationFn: createProject });

function isNetworkError(e: unknown): boolean {
  if (e instanceof TypeError) return true;
  const msg = e instanceof Error ? e.message : String(e);
  return /fetch|network|connection refused|failed to fetch/i.test(msg);
}

async function analyzeLp(lpInput: string): Promise<LpAnalysisResult> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/lp-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lpInput: lpInput.trim() }),
    });
  } catch (e) {
    if (isNetworkError(e)) {
      throw new Error(
        "APIサーバーに接続できません。api フォルダで「npm run dev」を実行していますか？（ポート 8787）"
      );
    }
    throw e;
  }
  const data = (await res.json()) as { ok: boolean; markdown?: string; error?: string };
  if (!data.ok || data.markdown === undefined) {
    throw new Error(data.error ?? "LP分析に失敗しました");
  }
  return { markdown: data.markdown };
}

const generateBanners = async (_banners: string[]) => {
  await new Promise<void>((resolve) => setTimeout(resolve, 3500));
};

export const useAnalyzeLp = () => useMutation({ mutationFn: analyzeLp });

export const useGenerateBanners = () => useMutation({ mutationFn: generateBanners });
