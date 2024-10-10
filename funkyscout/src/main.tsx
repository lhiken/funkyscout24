import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom';

import App from './app/app';
import Error from './components/errors/error';
import AuthPage from './app/auth/auth';
import Dashboard from './app/routes/dashboard';
import Auto from '../scoutingDev/auto';
import './utils/styles/reload.css'
import './utils/styles/index.css'
import './utils/styles/vars.css'
import ScoutingPage from './app/routes/scouting/scouting';
import DataPage from './app/routes/data/datapage';

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
        element={<Dashboard/>}
        path="/dashboard"
      />
      <Route 
        element={<ScoutingPage/>}
        path="/scouting"
      />
      <Route 
        element={<Auto/>}
        path="/auto"
      />
      <Route
        element={<DataPage/>}
        path="/data"
      />
    </Route>
  )
)

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
