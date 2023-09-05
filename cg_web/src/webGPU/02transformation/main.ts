import shader from './shader/shader.wgsl?raw';
import { createSquare } from './object';
import { IEnviroment } from '../interface';
import { mat3 } from './mat';

export default function render({scaleX,scaleY, translationX,translationY,rotation}:{[key:string]:number}){
  return function({device, context,presentationFormat, canvas}:IEnviroment){
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

  const uniformBufferSize = (12 + 4) * 4; //matrix + padding
  const uniformBuffer = device.createBuffer({
    label:'uniforms',
    size:uniformBufferSize,
    usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  //把matrix设置在uniform value 里面
  const uniformValues = new Float32Array(uniformBufferSize / 4);
  const bindGroup = device.createBindGroup({
    label:'bind group for transformation',
    layout:pipeline.getBindGroupLayout(0),
    entries:[
      {binding:0, resource:{buffer:uniformBuffer}}
    ]
  })
  //这里因为projection的取值和canvas的长宽有关系，因此要放在render里实时更新


  //初始化data(vertex, color, etc.)
  const {squareVertexData, squareNumVertices} = createSquare();
  const planVertexBuffer = device.createBuffer({
    label:'plan buffer vertices',
    size:squareVertexData.byteLength,
    usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(planVertexBuffer, 0, squareVertexData);

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
    const projectionMatrix = mat3.projection(canvas.clientWidth, canvas.clientHeight);
   
    const translationMatrix = mat3.translation([translationX, translationY]);
    const scaleMatrix = mat3.scaling([scaleX, scaleY]);
    const rotationMatrix = mat3.rotation(rotation);

    const matrixTemp =mat3.multiply(rotationMatrix,scaleMatrix);
    const matrixTemp2 =mat3.multiply(translationMatrix,matrixTemp);
    const matrix = mat3.multiply(projectionMatrix, matrixTemp2);

    const matrix4 =[ ...matrix.slice(0,3),0,...matrix.slice(3,6),0,0,0,1,0,...matrix.slice(6,9),1];
    uniformValues.set(matrix4);
    device.queue.writeBuffer(uniformBuffer, 0, uniformValues);
    pass.setBindGroup(0, bindGroup);

    pass.draw(squareNumVertices);
    pass.end();

    const commandBuffer = encoder.finish();
    device?.queue.submit([commandBuffer]);
  }

}}