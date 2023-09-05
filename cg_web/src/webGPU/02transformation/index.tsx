import {   useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { defaultStart } from '../utils/defaultStart';
import render from './main';
import {useControls} from 'leva';
import { IEnviroment } from '../interface';
import throttle from 'lodash/throttle';


export default function Transformation2DDemo() {

    const { webGPUId } = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {scaleX,scaleY, translationX,translationY, rotation} = useControls({
        scaleX:{
            min: 0,
            max: 10,
            value: 1,
            step:0.1
          },
        scaleY:{
            min: 0,
            max: 10,
            value: 1,
            step:0.1
          }, 
        translationX:{
            min: 0,
            max:1000,
            value: 0,
            step:1
          }, 
        translationY:{
            min: 0,
            max: 1000,
            value: 0,
            step:1
          }, 
        rotation:{
            min: -360,
            max: 360,
            value: 0,
            step:1
          }, 
    })
    const renderFn = useCallback(((device: IEnviroment)=>{
        return render({scaleX,scaleY, translationX,translationY, rotation})(device);
    }),[scaleX,scaleY, translationX,translationY, rotation])
    useEffect(() => {
        if (!canvasRef.current) return;
        defaultStart(canvasRef.current).then(
            (device) => {
                if (!device) return;
                //为了在刚开始渲染的时候，清晰度就足够
                const observer = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        const canvas = entry.target as HTMLCanvasElement;
                        if(!canvas || !device)return;
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
    }, [webGPUId, canvasRef, renderFn]);
    return <canvas ref={canvasRef} id="canvas" className="bg-black w-screen h-screen"></canvas>
}