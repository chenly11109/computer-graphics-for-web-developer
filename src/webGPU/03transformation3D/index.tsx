import { useEffect,useState, useRef, useCallback } from "react";
import { defaultStart } from "../utils/defaultStart";
import render from "./main";
import { useControls } from "leva";
import { IEnviroment } from "../interface";

export default function Transformation3DDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sx, sy, sz, tx, ty, tz, rx, ry, rz } = useControls({
    sx: {
      min: -10,
      max: 10,
      value: 1,
      step: 0.1,
    },
    sy: {
      min: -10,
      max: 10,
      value: 1,
      step: 0.1,
    },
    sz: {
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
      min: -200,
      max: 200,
      value: 0,
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
  });

  const renderFn = useCallback(
    (device: IEnviroment) => {
      return render({ sx, sy, sz, tx, ty, tz, rx, ry, rz })(device);
    },
    [sx, sy, sz, tx, ty, tz, rx, ry, rz]
  );

  const [device, setDevice] = useState<IEnviroment>();

  useEffect(() => {
    if (!canvasRef.current) return;
    defaultStart(canvasRef.current).then((device) => {
      setDevice(device);
    });
  }, [canvasRef]);

  useEffect(() => {
    if (!device || !canvasRef.current) return;
    //为了在刚开始渲染的时候，清晰度就足够
    const observer = new ResizeObserver((entries) => {
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
    observer.observe(canvasRef.current);
  }, [device]);

  useEffect(()=>{

    if(!device)return
    renderFn(device)();
  },[renderFn, device])
  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="bg-black w-screen h-screen"
    ></canvas>
  );
}
