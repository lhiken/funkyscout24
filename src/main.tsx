import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import App from './app/app';
import Error from './components/errors/error';
import AuthPage from './app/auth/auth';
import DashBoard from './app/routes/dashboard';
import './utils/styles/reload.css'
import './utils/styles/index.css'
import './utils/styles/vars.css'

const router = createBrowserRouter([
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
]);

const registerWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./src/utils/workers/sw.js');
      console.log('Service worker registration succeeded:', registration);
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerWorker();

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
