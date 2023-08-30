import {  useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { defaultStart } from '../utils/defaultStart';
import render from './main';
import {useControls} from 'leva';


export default function Transformation2DDemo() {

    const { webGPUId } = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {scale} = useControls({scale:10})
    const renderFn = useMemo(()=>{
        return render(scale);
    },[scale])
    useEffect(() => {
        if (!canvasRef.current) return;
        defaultStart(canvasRef.current).then(
            (device) => {
                if (!device) return;
             
                //为了在刚开始渲染的时候，清晰度就足够
                const observer = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        const canvas = entry.target as HTMLCanvasElement;
                        const width = entry.contentBoxSize[0].inlineSize;
                        const height = entry.contentBoxSize[0].blockSize;
                        canvas.width = Math.max(1, Math.min(width, device.device.limits.maxTextureDimension2D));
                        canvas.height = Math.max(1, Math.min(height, device.device.limits.maxTextureDimension2D));
                        // re-render
                        renderFn!(device)();
                    }
                });
                observer.observe(canvasRef.current!);

            }
        )
    }, [webGPUId, canvasRef]);
    return <canvas ref={canvasRef} id="canvas" className="bg-black w-screen h-screen"></canvas>
}