import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Notes from './components/Notes/index.tsx';
import Basics from './components/Basics/index.tsx';
import Transformation2D from './components/Transformation/index.tsx';
import Transformation2DDemo from './webGPU/02transformation/index.tsx';
import BasicsDemo from './webGpu/01basics/index.tsx';
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
  {
    path:"notes/",
    element:<Notes/>,
    children:[
      {
      path:'01basics',
      element:<Basics/>
    },
    {
      path:'02transformation2D',
      element:<Transformation2D/>
    },
  
  ]
  },
  {path:"webGPU/",
   children:[
    {
      path:'01basics',
      element:<BasicsDemo />
    },

    {path:'02transformation2D',
    element:<Transformation2DDemo />
  }
   ]
}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
