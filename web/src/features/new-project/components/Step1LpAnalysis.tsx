import { useAtom, useSetAtom } from "jotai";
import { Globe, Brain, CheckCircle2, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { lpUrlAtom, analysisCompleteAtom, currentStepAtom, lpAnalysisMarkdownAtom } from "../stores";
import { useAnalyzeLp } from "../api";
import { DEMO_LP_URLS } from "../utils/constants";

const AnalyzingState = () => (
  <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-8 text-center">
    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Loader2 size={24} className="text-violet-600 animate-spin" />
    </div>
    <h3 className="text-slate-800" style={{ fontSize: "16px", fontWeight: 600 }}>LP を分析中...</h3>
    <p className="text-slate-500 mt-2" style={{ fontSize: "13px" }}>ページ内容・ターゲット・インサイトを解析しています</p>
    <div className="space-y-2 mt-6 text-left max-w-sm mx-auto">
      {["ページ構成・コンテンツを読み込み中", "ターゲット層を分析中", "インサイト・ペインポイントを抽出中"].map((text) => (
        <div key={text} className="flex items-center gap-2.5 text-slate-500" style={{ fontSize: "12px" }}>
          <Loader2 size={12} className="text-violet-400 animate-spin" />
          {text}
        </div>
      ))}
    </div>
  </div>
);

export const Step1LpAnalysis = () => {
  const [lpUrl, setLpUrl] = useAtom(lpUrlAtom);
  const [analysisComplete, setAnalysisComplete] = useAtom(analysisCompleteAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);
  const setLpAnalysisMarkdown = useSetAtom(lpAnalysisMarkdownAtom);
  const { mutate: analyzeLp, isPending, isError, error } = useAnalyzeLp();

  const handleAnalyze = () => {
    if (!lpUrl.trim()) return;
    analyzeLp(lpUrl, {
      onSuccess: (data) => {
        setLpAnalysisMarkdown(data.markdown);
        setAnalysisComplete(true);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>LP（ランディングページ）を分析する</h2>
        <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>
          広告バナーを作りたいLPのURLを入力してください。AIがターゲットやインサイトを自動分析します。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <label className="block text-slate-700 mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>LP URL</label>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-gray-50">
            <Globe size={16} className="text-gray-400 shrink-0" />
            <input
              type="url"
              value={lpUrl}
              onChange={(e) => setLpUrl(e.target.value)}
              placeholder="https://example.com/lp"
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-gray-400"
              style={{ fontSize: "14px" }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!lpUrl.trim() || isPending || analysisComplete}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white rounded-xl px-5 py-3 transition-colors"
            style={{ fontSize: "14px" }}
          >
            {isPending ? <><Loader2 size={15} className="animate-spin" />分析中...</> : analysisComplete ? <><CheckCircle2 size={15} />分析完了</> : <><Brain size={15} />AI分析開始</>}
          </button>
        </div>
        {!analysisComplete && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-gray-400" style={{ fontSize: "12px" }}>例：</span>
            {DEMO_LP_URLS.map((url) => (
              <button
                key={url}
                onClick={() => setLpUrl(url)}
                className="text-violet-500 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg px-2.5 py-1 transition-colors"
                style={{ fontSize: "11px" }}
              >
                {url}
              </button>
            ))}
          </div>
        )}
      </div>

      {isPending && <AnalyzingState />}

      {isError && !isPending && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error?.message ?? "分析に失敗しました"}</p>
        </div>
      )}

      {analysisComplete && !isPending && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={15} className="text-emerald-600" />
            </div>
            <h3 className="text-slate-800" style={{ fontSize: "15px", fontWeight: 600 }}>分析が完了しました</h3>
            <span className="ml-auto text-slate-400" style={{ fontSize: "12px" }}>次のステップで詳細を確認・編集できます</span>
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 transition-colors"
            style={{ fontSize: "14px" }}
          >
            ターゲット情報を確認・編集する
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
