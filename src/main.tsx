import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Notes from './components/Notes';
import Basics from './components/01Basics';
import Transformation2D from './components/02Transformation';
import Transformation2DDemo from './webGPU/02transformation';
import BasicsDemo from './webGPU/01basics';
import Transformation3D from "./components/03Transformation3D"
import Transformation3DDemo from './webGPU/03transformation3D';
import Perspective from './components/04Perspective';
import PerspectiveDemo from './webGPU/04Perspective'
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
  
    {
      path:'03transformation3D',
      element:<Transformation3D/>
    },
    {
      path:'04Perspective',
      element:<Perspective/>
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
  },

  
  {path:'03transformation3D',
  element:<Transformation3DDemo />
},
{path:'04perspective',
  element:<PerspectiveDemo />
},
  
   ]
}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
