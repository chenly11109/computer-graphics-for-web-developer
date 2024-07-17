import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Notes from "./components/Notes";
import Basics from "./components/01Basics";
import Transformation2D from "./components/02Transformation";
import Transformation3D from "./components/03Transformation3D";
import Perspective from "./components/04Perspective";
import Camera from "./components/05Camera";
import MatrixStack from "./components/06MatrixStack";
import Diffuse from "./components/07Diffuse";
import Specular from "./components/08Specular";
import LightSource from "./components/09LightSource";

import BasicsDemo from "./webGPU/01basics";
import Transformation2DDemo from "./webGPU/02transformation";
import Transformation3DDemo from "./webGPU/03transformation3D";
import PerspectiveDemo from "./webGPU/04Perspective";
import CameraDemo from "./webGPU/05Camera";
import MatrixStackDemo from "./webGPU/06MatrixStack";
import LightDiffuseDemo from "./webGPU/07Diffuse";
import LightSpecularDemo from "./webGPU/08Specular"
import LightSourceDemo from "./webGPU/09LightSource/index.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "notes/",
      element: <Notes />,
      children: [
        {
          path: "01basics",
          element: <Basics />,
        },
        {
          path: "02transformation2D",
          element: <Transformation2D />,
        },

        {
          path: "03transformation3D",
          element: <Transformation3D />,
        },
        {
          path: "04Perspective",
          element: <Perspective />,
        },
        {
          path: "05Camera",
          element: <Camera />,
        },
        {
          path: "06Matrix",
          element: <MatrixStack />,
        },
        {
          path: "07Diffuse",
          element: <Diffuse />,
        },
        {
          path: "08Specular",
          element: <Specular />,
        },
        {
          path: "09LightSource",
          element: <LightSource />,
        },
      ],
    },
    {
      path: "webGPU/",
      children: [
        {
          path: "01basics",
          element: <BasicsDemo />,
        },

        { path: "02transformation2D", element: <Transformation2DDemo /> },
        { path: "03transformation3D", element: <Transformation3DDemo /> },
        { path: "04perspective", element: <PerspectiveDemo /> },
        { path: "05camera", element: <CameraDemo /> },
        { path: "06MatrixStack", element: <MatrixStackDemo /> },
        { path: "07Basics", element: <LightDiffuseDemo /> },
        { path: "08Specular", element: <LightSpecularDemo /> },
        { path: "09LightSource", element: <LightSourceDemo /> },
      ],
    },
  ],
  { basename: "/computer-graphics-for-web-developer/" }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
