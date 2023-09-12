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

import Camera from './components/05Camera';
import CameraDemo from "./webGPU/05Camera";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import MatrixStack from './components/06MatrixStack/index.tsx';
import MatrixStackDemo from './webGPU/06MatrixStack/index.tsx';

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
    {
      path:'05Camera',
      element:<Camera/>
    },
    {
      path:'06Matrix',
      element:<MatrixStack/>
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
{path:'05camera',
  element:<CameraDemo />
},
{path:'06MatrixStack',
  element:<MatrixStackDemo />
},
  
   ]
}
], {basename:'/computer-graphics-for-web-developer/'});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

      <RouterProvider router={router} />

  </React.StrictMode>,
)
