export async function defaultStart(canvas:HTMLCanvasElement){
    const context = canvas.getContext('webgpu');
       const adapter = await navigator.gpu?.requestAdapter();
       const device = await adapter?.requestDevice();
       if (!device || !context) {
         alert('need a browser that supports WebGPU');
         return;
       }
       const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
       context.configure({
       device,
       format: presentationFormat,
     });
     return {context, device, presentationFormat}
}