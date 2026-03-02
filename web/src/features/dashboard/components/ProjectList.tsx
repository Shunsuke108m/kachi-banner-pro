import { useNavigate } from "react-router";
import { ArrowRight, CheckCircle2, Sparkles, Download, Clock } from "lucide-react";
import { MOCK_PROJECTS } from "../utils/mock-data";

export const ProjectList = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-900" style={{ fontSize: "16px", fontWeight: 600 }}>最近の生成履歴</h2>
        <button className="text-violet-600 hover:text-violet-700 flex items-center gap-1" style={{ fontSize: "13px" }}>
          すべて見る <ArrowRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className="flex">
              <div className="w-24 h-24 shrink-0 overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-slate-800 truncate" style={{ fontSize: "13px", fontWeight: 600 }}>
                    {project.name}
                  </h3>
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0" style={{ fontSize: "11px" }}>
                    <CheckCircle2 size={10} />完了
                  </span>
                </div>
                <p className="text-slate-400 truncate mt-0.5" style={{ fontSize: "11px" }}>{project.lpUrl}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-slate-500" style={{ fontSize: "12px" }}>
                    <Sparkles size={12} className="text-violet-400" />{project.bannerCount}本生成
                  </span>
                  <span className="flex items-center gap-1 text-slate-500" style={{ fontSize: "12px" }}>
                    <Download size={12} className="text-emerald-400" />{project.purchasedCount}本購入
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 ml-auto" style={{ fontSize: "11px" }}>
                    <Clock size={10} />{project.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
