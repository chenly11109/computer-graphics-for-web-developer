import { useEffect, useState, useRef, useCallback } from "react";
import { defaultStart } from "../utils/defaultStart";
import render from "./main";
import { useControls, folder } from "leva";
import { IEnviroment } from "../interface";

export default function Transformation3DDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cx,cy,cz,tx,ty,tz,upX,upY,upZ,fov,zNear,zFar
  } = useControls({
    camera: folder({
      cx:100,
      cy:0,
      cz:100
    }),
    object:folder( {
      tx:0,
      ty:0,
      tz:0
      }),
    direction: folder({
        upX:0,
        upY:1,
        upZ:0
      }),

      perspective: folder({
        fov: {
          min: 25,
          max: 180,
          value: 45,
          step: 1,
        },
        zNear: {
          min: -250,
          max: -20,
          value: -50,
          step: 10,
        },
        zFar: {
          min: -5000,
          max: -300,
          value: -1000,
          step: 10,
        },
      }),
  });

  const renderFn = useCallback(
    (device: IEnviroment) => {
      return render({ cx,cy,cz,tx,ty,tz,upX,upY,upZ,fov,zNear,zFar
      })(device);
    },
    [cx,cy,cz,tx,ty,tz,upX,upY,upZ,fov,zNear,zFar]
  );

  const [device, setDevice] = useState<IEnviroment>();

  useEffect(() => {
    if (!canvasRef.current) return;
    defaultStart(canvasRef.current).then((device) => {
      setDevice(device);
    });
  }, [canvasRef]);

  const observerRef = useRef<ResizeObserver>();
  useEffect(() => {
    if (!device || !canvasRef.current) return;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    //为了在刚开始渲染的时候，清晰度就足够
    observerRef.current = new ResizeObserver((entries) => {
      if (!device) return;
      for (const entry of entries) {
        const canvas = entry.target as HTMLCanvasElement;
        const width = entry.contentBoxSize[0].inlineSize;
        const height = entry.contentBoxSize[0].blockSize;
        canvas.width = Math.max(
          1,
          Math.min(width, device.device.limits.maxTextureDimension2D)
        );
        canvas.height = Math.max(
          1,
          Math.min(height, device.device.limits.maxTextureDimension2D)
        );
        // re-render
        renderFn(device)();
      }
    });
    observerRef.current.observe(canvasRef.current);
  }, [device, renderFn]);

  useEffect(() => {
    if (!device) return;
    renderFn(device)();
  }, [renderFn, device]);
  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="bg-black w-screen h-screen"
    ></canvas>
  );
}
