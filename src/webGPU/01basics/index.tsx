import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { defaultStart } from '../utils/defaultStart';
import render from './main.ts';


export default function BasicsDemo() {

    const { webGPUId } = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if (!canvasRef.current) return;
        defaultStart(canvasRef.current).then(
            (device) => {

                if (!device) return;
                const renderFn = render(device);
                //为了在刚开始渲染的时候，清晰度就足够
                const observer = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        const canvas = entry.target as HTMLCanvasElement;
                        const width = entry.contentBoxSize[0].inlineSize;
                        const height = entry.contentBoxSize[0].blockSize;
                        canvas.width = Math.max(1, Math.min(width, device.device.limits.maxTextureDimension2D));
                        canvas.height = Math.max(1, Math.min(height, device.device.limits.maxTextureDimension2D));
                        // re-render
                        renderFn!();
                    }
                });
                observer.observe(canvasRef.current!);

            }
        )
    }, [webGPUId, canvasRef]);
    return <canvas ref={canvasRef} id="canvas" className="bg-black w-screen h-screen"></canvas>
}