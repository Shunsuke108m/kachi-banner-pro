import { createBrowserRouter } from "react-router";
import { Layout } from "../../components/Layout";
import { Dashboard } from "../../features/dashboard";
import { NewProject } from "../../features/new-project";
import { ProjectDetail } from "../../features/project-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "new", Component: NewProject },
      { path: "project/:id", Component: ProjectDetail },
    ],
  },
]);
