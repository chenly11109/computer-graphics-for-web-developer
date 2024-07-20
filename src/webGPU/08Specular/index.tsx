import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { defaultStart } from "../utils/defaultStart";
import render from "./main";
import { useControls, folder } from "leva";
import { IEnviroment } from "../interface";
import { hexToRgb } from "../utils/hexToRgb";

export default function SpecularDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotateY, setRotateX] = useState(0);

  const { lightX, lightY, lightZ, lightColor: lightColorHex, objectColor: objectColorHex, shininess } = useControls({
    light: folder({
      lightX: {
        min: -500,
        max: 500,
        value: 200,
        step: 5,
      },
      lightY: {
        min: -500,
        max: 500,
        value: 0,
        step: 5,
      },
      lightZ: {
        min: -500,
        max: 500,
        value: 0,
        step: 5,
      },
      lightColor: { value: 'gold' },

    }),
    object: folder({
      objectColor: { value: 'purple' },
      shininess: {
        min: 5,
        max: 300,
        value: 40,
        step: 5,
      }
    })
  })

  const lightColor = useMemo(() => hexToRgb(lightColorHex), [lightColorHex])
  const objectColor = useMemo(() => hexToRgb(objectColorHex), [objectColorHex])

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      switch (e?.key) {
        case "a":
          setRotateX((Z) => Z + 5);
          break;
        case "d":
          setRotateX((Z) => Z - 5);
          break;
        default:
          return;
      }
    });
  }, []);



  const renderFn = useCallback(
    (device: IEnviroment) => {
      return render({ rotateY, lightX, lightY, lightZ, lightColor, objectColor, shininess })(device);
    },
    [rotateY, lightX, lightY, lightZ, lightColor, objectColor, shininess]
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
