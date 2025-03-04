import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./app/app";
import Error from "./components/errors/error";
import AuthPage from "./app/auth/auth";
import Dashboard from "./app/routes/dashboard";
import "./utils/styles/reload.css";
import "./utils/styles/index.css";
import "./utils/styles/vars.css";
import ScoutingPage from "./app/routes/scouting/scouting";
import DataPage from "./app/routes/data/datapage";
import MatchScouting from "./app/routes/scouting/matches/matchScouting";
import TeamPage from "./app/routes/data/teampage";

/* const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path:"/dashboard",
        element:<DashBoard/>,
      }
    ]
  }
]); */

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<App />}
      errorElement={<Error />}
      path="/"
    >
      <Route
        element={<AuthPage />}
        path="/auth"
      />
      <Route
        element={<Dashboard />}
        path="/dashboard"
      />
      <Route
        element={<ScoutingPage />}
        path="/scouting"
      />
      <Route
        element={<DataPage />}
        path="/data"
      />
      <Route 
        element={<MatchScouting />} 
        path="/scout/matches/:id" 
      />
      <Route 
        element={<TeamPage />} 
        path="/data/team/:id" 
      />
    </Route>,
  ),
);

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
