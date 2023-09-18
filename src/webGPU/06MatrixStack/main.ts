import shader from "./shader/shader.wgsl?raw";
// import { createCubic } from "./object/object";
import { IEnviroment } from "../interface";
import { MatrixStack } from "./object/stack";
import { createTeapot } from "./object/teaport";
import { createCubicIndices } from "./object/object";
import { createPlan } from "./object/plan";

export default function render({
  cx,
  cy,
  cz,
  tx,
  ty,
  tz,
  upX,
  upY,
  upZ,
  fov,
  zNear,
  zFar,
  imageBitMap
}: {imageBitMap:ImageBitmap } & { [key: string]: number }) {

  return function ({
    device,
    context,
    presentationFormat,
    canvas,
  }: IEnviroment) {
    const module = device.createShaderModule({
      label: "a basic shader",
      code: shader,
    });

    // 初始化shader/pipeline(GPU)
    const pipeline = device.createRenderPipeline({
      label: "render pipeline",
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs",
        buffers: [
          {
            arrayStride: 4 * 3, // (3) floats 4 bytes each + one 4 byte color
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" }, // position
              // { shaderLocation: 1, offset: 12, format: "unorm8x4" }, // color
            ],
          },
        ],
      },
      fragment: {
        module,
        entryPoint: "fs",
        targets: [{ format: presentationFormat }],
      },
      primitive: {
        cullMode: "none",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    });

    //初始化data(vertex)
    //teapot 
    const {vertexData:teapotVertexData, indexData:teapotIndexData,numIndices:teapotNumIndices} = createTeapot();
    const teapotVertexBuffer = device.createBuffer({
      label:'teapot vertices',
      size:teapotVertexData.byteLength,
      usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    const teapotIndexBuffer = device.createBuffer({
      label:'teapot vertices',
      size:teapotIndexData.byteLength,
      usage:GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })
  
  
  //cubic
  const {cubicIndexData,cubicNumIndices,cubicVertexData} = createCubicIndices();
  const cubicVertexBuffer = device.createBuffer({
      label:'cubic vertices',
      size:cubicVertexData.byteLength,
      usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
  const cubicIndexBuffer = device.createBuffer({
      label:'cubic indices',
      size:cubicIndexData.byteLength,
      usage:GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })

  //plan
  const {planNumIndices, planVertexData, planIndexData} = createPlan();
  const planVertexBuffer = device.createBuffer({
      label:'plan vertices',
      size:planVertexData.byteLength,
      usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
  const planIndexBuffer = device.createBuffer({
      label:'plan index',
      size:planIndexData.byteLength,
      usage:GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })

  //planTexture
  const planTexture = device.createTexture({
      size:[imageBitMap.width, imageBitMap.height, 1],
      format:'rgba8unorm',
      usage:GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
    })
  const samplerDescriptor : GPUSamplerDescriptor = {
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
      magFilter: 'nearest',
      minFilter: 'nearest',
    }

    const colorBufferSize = 16 * 4 ;
    //cubic color
    const cubicColorBuffer = device.createBuffer({
      label:'cubic color buffer',
      size:colorBufferSize,
      usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const cubicColorValue = new Float32Array([0.1,0.1,0,1,1]);
  

  const sampler = device.createSampler(samplerDescriptor);
  const textureBindGroup = device.createBindGroup({
    label: "bind group for texture",
    layout: pipeline.getBindGroupLayout(1),
    entries: [
              {binding:0, resource:{buffer:cubicColorBuffer}},
              {binding:1, resource:sampler},
              {binding:2, resource:planTexture.createView()}
    ],
  });



  // const colorBindGroup = device.createBindGroup({
  //   label:'cubic color bind group',
  //   layout:pipeline.getBindGroupLayout(1),
  //   entries:[{binding:0, resource:{buffer:cubicColorBuffer}}]
  // })
  


  //view matrix uniform
    const uniformBufferSize = 16 * 4;
    const uniformBuffer = device.createBuffer({
      label: "uniforms",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const uniformValues = new Float32Array(uniformBufferSize / 4);

    const viewMatrixBindGroup = device.createBindGroup({
      label:'bind group for view',
      layout:pipeline.getBindGroupLayout(2),
      entries:[{binding:0, resource:{buffer:uniformBuffer}}]
    })

    const objectTypeBufferSize = 16;

    //object type 1 = cubic & plan
    const objectTypeBuffer = device.createBuffer({
      label:'object type buffer1',
      size:objectTypeBufferSize,
      usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const objectTypeBindGroup =   device.createBindGroup({
      label:'bind group for object',
      layout:pipeline.getBindGroupLayout(0),
      entries:[{
        binding:0, resource:{buffer:objectTypeBuffer}
      }]})
      device.queue.writeBuffer(objectTypeBuffer, 0, new Uint32Array([1]));


      // object type 0 = plan
      const objectTypeBuffer2 = device.createBuffer({
        label:'object type buffer2',
        size:objectTypeBufferSize,
        usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
      const objectType2BindGroup =   device.createBindGroup({
        label:'bind group for object',
        layout:pipeline.getBindGroupLayout(0),
        entries:[{binding:0, resource:{buffer:objectTypeBuffer2}}]})
      device.queue.writeBuffer(objectTypeBuffer2, 0, new Uint32Array([0]));



    const clearColor = { r: 0, g: 0, b: 0, a: 1.0 };

    // 设定一条渲染的线程
    const renderPassDescriptor = {
      label: "render pass",
      colorAttachments: [
        {
          loadOp: "clear",
          storeOp: "store",
          clearValue: clearColor,
          view: undefined as unknown as GPUTextureView,
        },
      ],

      depthStencilAttachment: {
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
        view: undefined as unknown as GPUTextureView,
      },
    };

    let depthTexture: GPUTexture;

    const matrixStack = new MatrixStack();


    return function render() {
      //view必须在创建context时动态render
      const canvasTexture = context.getCurrentTexture();
      renderPassDescriptor.colorAttachments[0].view =
        canvasTexture.createView();

      if (
        !depthTexture ||
        depthTexture.width !== canvasTexture.width ||
        depthTexture.height !== canvasTexture.height
      ) {
        if (depthTexture) {
          depthTexture.destroy();
        }
        depthTexture = device.createTexture({
          size: [canvasTexture.width, canvasTexture.height],
          format: "depth24plus",
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
      }

      renderPassDescriptor.depthStencilAttachment.view =
        depthTexture.createView();
      const encoder = device?.createCommandEncoder();
      const pass = encoder?.beginRenderPass(
        renderPassDescriptor as GPURenderPassDescriptor
      );
      if (!pass || !encoder) {
        return;
      }
      pass.setPipeline(pipeline);
      pass.setBindGroup(1, textureBindGroup);

      matrixStack.scale([20,20,20]);
      matrixStack.translate([tx, ty, tz]);
      //width/height
      const aspect = canvas.clientWidth / canvas.clientHeight;
      matrixStack.perspective(fov, aspect, zNear, zFar);
      matrixStack.lookAt([cx, cy, cz], [0, 0, 0], [upX, upY, upZ]);

      uniformValues.set(matrixStack.getCurrMatrix());
      device.queue.writeBuffer(uniformBuffer, 0, uniformValues);
      pass.setBindGroup(2, viewMatrixBindGroup);     
      pass.setBindGroup(0, objectTypeBindGroup);
    
      //teapot
      pass.setVertexBuffer(0, teapotVertexBuffer);
      pass.setIndexBuffer(teapotIndexBuffer,"uint16" )
      device.queue.writeBuffer(teapotVertexBuffer, 0, teapotVertexData);
      device.queue.writeBuffer(teapotIndexBuffer, 0, teapotIndexData);
      // pass.drawIndexed(teapotNumIndices);


      //cubic
      pass.setVertexBuffer(0, cubicVertexBuffer);
      pass.setIndexBuffer(cubicIndexBuffer, "uint16");
      device.queue.writeBuffer(cubicVertexBuffer, 0, cubicVertexData);
      device.queue.writeBuffer(cubicIndexBuffer, 0, cubicIndexData);
      pass.drawIndexed(cubicNumIndices);
      pass.setBindGroup(0, objectType2BindGroup);


      
      //plan
      pass.setVertexBuffer(0, planVertexBuffer);
      pass.setIndexBuffer(planIndexBuffer, "uint16");
      device.queue.writeBuffer(planVertexBuffer, 0 , planVertexData);
      device.queue.writeBuffer(planIndexBuffer, 0, planIndexData);
      device.queue.copyExternalImageToTexture(
        { source: imageBitMap },
        { texture: planTexture },
        [imageBitMap.width, imageBitMap.height]
      );

      pass.drawIndexed(planNumIndices);

      pass.end();

      const commandBuffer = encoder.finish();
      device?.queue.submit([commandBuffer]);
    };
  };
}
