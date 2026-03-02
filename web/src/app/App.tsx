import { RouterProvider } from "react-router";
import { AppProvider } from "./app-provider";
import { router } from "./routes";

const App = () => (
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);

export default App;
