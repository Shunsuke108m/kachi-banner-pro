import { useNavigate } from "react-router";
import { ImagePlus } from "lucide-react";
import { StatsGrid } from "./components/StatsGrid";
import { QuickStartBanner } from "./components/QuickStartBanner";
import { ProjectList } from "./components/ProjectList";
import { TipsSection } from "./components/TipsSection";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "22px", fontWeight: 700 }}>ダッシュボード</h1>
          <p className="text-slate-500 mt-1" style={{ fontSize: "14px" }}>今月も効率よく高品質なバナーを生成しましょう</p>
        </div>
        <button
          onClick={() => navigate("/new")}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md shadow-violet-200"
          style={{ fontSize: "14px" }}
        >
          <ImagePlus size={16} />
          新規バナーを生成
        </button>
      </div>
      <StatsGrid />
      <QuickStartBanner />
      <ProjectList />
      <TipsSection />
    </div>
  );
};
