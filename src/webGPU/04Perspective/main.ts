import shader from './shader/shader.wgsl?raw';
import { createCubic } from './object';
import { IEnviroment } from '../interface';
import { mat4 } from './mat';

export default function render({sx,sy,sz, tx,ty,tz, rx, ry, rz}:{[key:string]:number}){
return function({device, context,presentationFormat, canvas}:IEnviroment){
  const module = device.createShaderModule({
    label:'a basic shader',
    code:shader
  })

  // 初始化shader/pipeline(GPU)
  const pipeline = device.createRenderPipeline({
    label:'render cubic',
    layout:'auto',
    vertex: {
        module,
        entryPoint: 'vs',
        buffers: [
          {
            arrayStride: (4) * 4, // (3) floats 4 bytes each + one 4 byte color
            attributes: [
              {shaderLocation: 0, offset: 0, format: 'float32x3'},  // position
              {shaderLocation: 1, offset: 12, format: 'unorm8x4'},  // color
            ],
          },
        ],
      },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{ format: presentationFormat,
          blend: {
            color: {
              srcFactor:'src',
              //黑底图减去颜色
              operation: 'add',
              dstFactor: 'one-minus-src-alpha',
            },
            alpha: {},
          },
        }],
        
      },
    primitive:{
      cullMode:'none'
    },
    depthStencil:{
      depthWriteEnabled:true,
      depthCompare:'less',
      format:'depth24plus'
    }

  });

  //初始化data(vertex, color, etc.)
  const {cubicVertexData, cubicNumVertices} = createCubic();
  const cubicVertexBuffer = device.createBuffer({
    label:'plan buffer vertices',
    size:cubicVertexData.byteLength,
    usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(cubicVertexBuffer, 0, cubicVertexData);

  const uniformBufferSize = (16) * 4;
  const uniformBuffer = device.createBuffer({
    label: 'uniforms',
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const uniformValues = new Float32Array(uniformBufferSize / 4);
  const bindGroup = device.createBindGroup({
    label: 'bind group for view matrix',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer }},
    ],
  });
  const clearColor = { r: 0, g: 0, b: 0, a: 1.0 };

  // 设定一条渲染的线程
  const renderPassDescriptor = {
    label:'render pass',
    colorAttachments:[
        {
            loadOp:'clear',
            storeOp:'store',
            clearValue:clearColor,
            view:undefined as unknown as GPUTextureView,
            
        }
    ],

    depthStencilAttachment:{
      depthClearValue:1.0,
      depthLoadOp:'clear',
      depthStoreOp:'store',
      view:undefined as unknown as GPUTextureView
    },
    
  };

  let depthTexture:GPUTexture;

  return function render(){
    //view必须在创建context时动态render
    const canvasTexture = context.getCurrentTexture();
    renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView();

    if (!depthTexture ||
      depthTexture.width !== canvasTexture.width ||
      depthTexture.height !== canvasTexture.height) {
    if (depthTexture) {
      depthTexture.destroy();
    }
    depthTexture = device.createTexture({
      size: [canvasTexture.width, canvasTexture.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }


    renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();
    const encoder = device?.createCommandEncoder();
    const pass = encoder?.beginRenderPass(renderPassDescriptor as GPURenderPassDescriptor);
    if(!pass || !encoder){return}
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, cubicVertexBuffer);

    const projectionMatrix = mat4.ortho(     
    -canvas.clientWidth/2,                  // left
    canvas.clientWidth/2,  // right
    canvas.clientHeight/2, // bottom
    -canvas.clientHeight/2,                   // top
    400,                 // near
    -400,                // far
     );

     const scaleMatrix = mat4.scaling([sx, sy, sz]);
     const translationMatrix = mat4.translation([tx,ty,tz]);
     const rotationXMatrix = mat4.rotationX(rx);
     const rotationYMatrix = mat4.rotationY(ry);
     const rotationZMatrix = mat4.rotationZ(rz);

     const matrix = new Float32Array(16);

     mat4.multiply(rotationXMatrix, scaleMatrix, matrix);
     mat4.multiply(rotationYMatrix, matrix, matrix);
     mat4.multiply(rotationZMatrix, matrix, matrix);

    
     mat4.multiply(translationMatrix, matrix, matrix);

     mat4.multiply(projectionMatrix, matrix, matrix);

     uniformValues.set(matrix);
     device.queue.writeBuffer(uniformBuffer, 0, uniformValues);

    pass.setBindGroup(0, bindGroup);
    pass.draw(cubicNumVertices);
    pass.end();

    const commandBuffer = encoder.finish();
    device?.queue.submit([commandBuffer]);
  }

}}