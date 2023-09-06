export async function defaultStart(canvas:HTMLCanvasElement){
    const context = canvas?.getContext('webgpu');
       const adapter = await navigator.gpu?.requestAdapter();
       const device = await adapter?.requestDevice();
       if (!device) {
         alert('need a browser that supports WebGPU');
         return;
       }
       if (!context) {
        alert('cannot find context');
        return;
      }
       const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
       context.configure({
       device,
       format: presentationFormat,
       alphaMode: "premultiplied",
     });
     return {context, device, presentationFormat, canvas}
}