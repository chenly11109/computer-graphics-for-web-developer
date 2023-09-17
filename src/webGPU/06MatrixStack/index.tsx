import { useEffect, useState, useRef, useCallback } from "react";
import { defaultStart } from "../utils/defaultStart";
import render from "./main";
import { useControls, folder } from "leva";
import { IEnviroment } from "../interface";
import { createPlanTexture } from "./object/plan";

export default function MatrixStackDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cx, cy, cz, tx, ty, tz, upX, upY, upZ, fov, zNear, zFar} =
    useControls({
      camera: folder({
        position: folder({
          cx: {
            min: -500,
            max: 500,
            value: 0,
            step: 5,
          },
          cy: {
            min: -500,
            max: 500,
            value: 0,
            step: 5,
          },
          cz: {
            min: -500,
            max: 500,
            value: 500,
            step: 5,
          },
        }),
        direction: folder({
          upX: {min:-1, max:1,value:0, step:0.1},
          upY: {min:-1, max:1,value:1, step:0.1},
          upZ: {min:-1, max:1,value:0, step:0.1},
        }),
      }),
      object: folder({
        tx: {
          min: -500,
          max: 500,
          value: 0,
          step: 5,
        },
        ty: {
          min: -500,
          max: 500,
          value: 0,
          step: 5,
        },
        tz: {
          min: -500,
          max: 500,
          value: -200,
          step: 5,
        },
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

    const [imageBitMap, setImageBitMap] = useState<ImageBitmap>();

  const renderFn = useCallback(
    (device: IEnviroment) => {
      return render({
        cx,
        cy,
        cz,
        tx,
        ty,
        tz,
        upX,
        upY,
        upZ,
        fov,
        zNear,
        zFar,
        imageBitMap 
      } as any)(device);
    },
    [cx, cy, cz, tx, ty, tz, upX, upY, upZ, fov, zNear, zFar, imageBitMap]
  );

  const [device, setDevice] = useState<IEnviroment>();
  useEffect(() => {
    if (!canvasRef.current) return;
    defaultStart(canvasRef.current).then((device) => {
      setDevice(device);
    });

    createPlanTexture().then((image)=>setImageBitMap(image));
  }, [canvasRef]);

  const observerRef = useRef<ResizeObserver>();
  useEffect(() => {
    if (!device || !canvasRef.current) return;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    //为了在刚开始渲染的时候，清晰度就足够
    observerRef.current = new ResizeObserver((entries) => {
      if (!device || !imageBitMap) return;
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
    if (!device || !imageBitMap) return;
    renderFn(device)();
  }, [renderFn, device, imageBitMap]);
  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="bg-black w-screen h-screen"
    ></canvas>
  );
}
