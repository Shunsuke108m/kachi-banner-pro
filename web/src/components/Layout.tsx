import { Outlet, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  ImagePlus,
  History,
  Settings,
  CreditCard,
  ChevronRight,
  ChevronDown,
  Zap,
  Bell,
  User,
  FolderOpen,
} from "lucide-react";
import { useProjectList } from "../features/project-detail/api";

const NAV_ITEMS = [
  { icon: ImagePlus, label: "新規バナー生成", to: "/new" },
  { icon: History, label: "生成履歴", to: "/#history" },
  { icon: CreditCard, label: "購入・課金", to: "/#billing" },
  { icon: Settings, label: "設定", to: "/#settings" },
] as const;

const UsageMeter = () => (
  <div className="mx-3 mb-3 p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-300" style={{ fontSize: "12px" }}>今月の生成数</span>
      <span className="text-violet-300" style={{ fontSize: "12px", fontWeight: 600 }}>12 / 30</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-1.5">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full" style={{ width: "40%" }} />
    </div>
    <p className="text-slate-500 mt-1.5" style={{ fontSize: "11px" }}>残り18回生成可能</p>
  </div>
);

const UserFooter = () => (
  <div className="px-3 pb-4 border-t border-slate-700/50 pt-3">
    <div className="flex items-center gap-2.5 px-2">
      <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
        <User size={13} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-slate-200 truncate" style={{ fontSize: "12px", fontWeight: 500 }}>田中 広告事務所</div>
        <div className="text-slate-500 truncate" style={{ fontSize: "11px" }}>tanaka@example.com</div>
      </div>
      <Bell size={14} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
    </div>
  </div>
);

const PROJECTS_SECTION_OPEN_KEY = "sidebar-projects-open";

export const Layout = () => {
  const navigate = useNavigate();
  const [projectsOpen, setProjectsOpen] = useState(() => {
    try {
      const v = localStorage.getItem(PROJECTS_SECTION_OPEN_KEY);
      return v !== "false";
    } catch {
      return true;
    }
  });
  const { data: projects = [] } = useProjectList();

  const toggleProjects = () => {
    setProjectsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(PROJECTS_SECTION_OPEN_KEY, String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white" style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>BannerAI</div>
              <div className="text-slate-400" style={{ fontSize: "11px", lineHeight: 1.2 }}>広告バナー自動生成</div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-3">
          <button
            onClick={() => navigate("/new")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg px-3 py-2.5 transition-all duration-200 shadow-lg shadow-violet-900/30"
            style={{ fontSize: "13px" }}
          >
            <Zap size={14} />
            新規バナーを生成
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-auto min-h-0">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive ? "bg-violet-600/20 text-violet-300" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={16} className={isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"} />
                <span style={{ fontSize: "13px" }}>ダッシュボード</span>
                {isActive && <ChevronRight size={12} className="ml-auto text-violet-400" />}
              </>
            )}
          </NavLink>
          <div className="pt-2 pb-1">
            <button
              type="button"
              onClick={toggleProjects}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              {projectsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              プロジェクト
            </button>
            {projectsOpen && (
              projects.length === 0 ? (
                <div className="px-3 py-2 pl-6 text-slate-500" style={{ fontSize: "12px" }}>プロジェクトはまだありません</div>
              ) : (
                projects.map((p) => (
                  <NavLink
                    key={p.id}
                    to={`/project/${p.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group pl-6 ${
                        isActive ? "bg-violet-600/20 text-violet-300" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <FolderOpen size={14} className={isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300 shrink-0"} />
                        <span className="truncate" style={{ fontSize: "13px" }}>{p.name}</span>
                        {isActive && <ChevronRight size={12} className="ml-auto text-violet-400 shrink-0" />}
                      </>
                    )}
                  </NavLink>
                ))
              )
            )}
          </div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive ? "bg-violet-600/20 text-violet-300" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} className={isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"} />
                  <span style={{ fontSize: "13px" }}>{item.label}</span>
                  {isActive && <ChevronRight size={12} className="ml-auto text-violet-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <UsageMeter />
        <UserFooter />
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
