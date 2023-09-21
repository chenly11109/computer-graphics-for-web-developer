import { useEffect, useState, useRef, useCallback } from "react";
import { defaultStart } from "../utils/defaultStart";
import render from "./main";
import { useControls, folder } from "leva";
import { IEnviroment } from "../interface";
import { createPlanTexture } from "./object/plan";

export default function MatrixStackDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tx, ty, tz,fov, zNear, zFar} =
    useControls({
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
            value: -500,
            step: 10,
          },
        }),

    });
const [rotateX, setRotateX] = useState(0);
const [rotateZ, setRotateZ] = useState(0);
    const [imageBitMap, setImageBitMap] = useState<ImageBitmap>();

    const handleKeyDown = (e:any)=>{
      switch(e?.key){
        case 'w':
          setRotateX(X =>X-5);
          break;
        case 's':
          setRotateX(X =>X+5);
          break
        case 'a':
          setRotateZ(Z=>Z+5);
            break
        case 'd':
          setRotateZ(Z=>Z-5);
          break

        case 'r':
          setRotateX(0);
          setRotateZ(0);
          break;
        default:
          return
      }
    }
    useEffect(()=>{
      document.addEventListener("keydown", handleKeyDown)
      return ()=>{document.removeEventListener("keydown", handleKeyDown)};
    },[])
  const renderFn = useCallback(
    (device: IEnviroment) => {
      return render({
        rotateX,
        rotateZ,
        tx,
        ty,
        tz,
        fov,
        zNear,
        zFar,
        imageBitMap 
      } as any)(device);
    },
    [rotateX, rotateZ, tx, ty, tz, fov, zNear, zFar, imageBitMap]
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
