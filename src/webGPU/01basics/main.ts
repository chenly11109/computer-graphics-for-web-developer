import shader from './shader/shader.wgsl?raw';
import { createPlan } from './object';
import { IEnviroment } from '../interface';

export default function render({device, context,presentationFormat}:IEnviroment){

  const module = device.createShaderModule({
    label:'a basic shader',
    code:shader
  })

  // 初始化shader/pipeline(GPU)
  const pipeline = device.createRenderPipeline({
    label:'render plan',
    layout:'auto',
    vertex: {
        module,
        entryPoint: 'vs',
        buffers: [
          {
            arrayStride: (3) * 4, // (2) floats 4 bytes each + one 4 byte color
            attributes: [
              {shaderLocation: 0, offset: 0, format: 'float32x2'},  // position
              {shaderLocation: 1, offset: 8, format: 'unorm8x4'},  // color
            ],
          },
        ],
      },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{ format: presentationFormat }],
      },
  });

  //初始化data(vertex, color, etc.)
  const {planVertexData, planNumVertices} = createPlan();
  const planVertexBuffer = device.createBuffer({
    label:'plan buffer vertices',
    size:planVertexData.byteLength,
    usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(planVertexBuffer, 0, planVertexData);

  // 设定一条渲染的线程
  const renderPassDescriptor = {
    label:'render pass',
    colorAttachments:[
        {
            loadOp:'clear',
            storeOp:'store',
            view:undefined as unknown as GPUTextureView
        }
    ]
  };

  return function render(){
    //view必须在创建context时动态render
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
    const encoder = device?.createCommandEncoder();
    const pass = encoder?.beginRenderPass(renderPassDescriptor as GPURenderPassDescriptor);
    if(!pass || !encoder){return}
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, planVertexBuffer);
    pass.draw(planNumVertices);
    pass.end();

    const commandBuffer = encoder.finish();
    device?.queue.submit([commandBuffer]);
  }

}