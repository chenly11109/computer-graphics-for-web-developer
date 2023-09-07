import { useEffect, useState, useRef, useCallback } from "react";
import { defaultStart } from "../utils/defaultStart";
import render from "./main";
import { useControls, folder } from "leva";
import { IEnviroment } from "../interface";

export default function Transformation3DDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sx, tx, ty, tz, rx, ry, rz, fov, zNear, zFar } = useControls({
    perspective: folder({
      fov: {
        min: 35,
        max: 200,
        value: 45,
        step: 1,
      },
      zNear: {
        min: 20,
        max: 250,
        value: 50,
        step: 10,
      },
      zFar: {
        min: 300,
        max: 5000,
        value: 1000,
        step: 10,
      },
    }),
    object: folder({
      sx: {
        min: -10,
        max: 10,
        value: 1,
        step: 0.1,
      },

      tx: {
        min: -200,
        max: 200,
        value: 0,
        step: 1,
      },
      ty: {
        min: -200,
        max: 200,
        value: 0,
        step: 1,
      },
      tz: {
        min: -2000,
        max: -100,
        value: -300,
        step: 1,
      },
      rx: {
        min: -360,
        max: 360,
        value: 0,
        step: 1,
      },
      ry: {
        min: -360,
        max: 360,
        value: 0,
        step: 1,
      },
      rz: {
        min: -360,
        max: 360,
        value: 0,
        step: 1,
      },
    }),
  });

  const renderFn = useCallback(
    (device: IEnviroment) => {
      return render({ sx, tx, ty, tz, rx, ry, rz, fov, zNear, zFar })(device);
    },
    [sx, tx, ty, tz, rx, ry, rz, zNear, fov, zFar]
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
