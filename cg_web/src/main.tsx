import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import WebGPUWrapper from './webGPU/index.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {path:"webGPU/:webGPUId",
   element:<WebGPUWrapper />,
}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
