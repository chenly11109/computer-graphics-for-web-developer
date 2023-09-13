import shader from "./shader/shader.wgsl?raw";
// import { createCubic } from "./object/object";
import { IEnviroment } from "../interface";
import { MatrixStack } from "./object/stack";
import { createTeapot } from "./object/teaport";
import { createCubicIndices } from "../03transformation3D/object";
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
  usePerspective,
  imageBitMap
}: { usePerspective: boolean, imageBitMap:ImageBitmap } & { [key: string]: number }) {

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
      label: "render cubic",
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
        cullMode: "back",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    });

    //初始化data(vertex, color, etc.) 
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

    const planTexture = device.createTexture({
      size:[imageBitMap.width, imageBitMap.height, 1],
      format:'rgba8unorm',
      usage:GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
    })


    const uniformBufferSize = 16 * 4;
    const uniformBuffer = device.createBuffer({
      label: "uniforms",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const uniformValues = new Float32Array(uniformBufferSize / 4);
    const bindGroup = device.createBindGroup({
      label: "bind group for view matrix",
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });
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
      // matrixStack.scale([20,20,20]);
      matrixStack.translate([tx, ty, tz]);
      //width/height
      const aspect = canvas.clientWidth / canvas.clientHeight;
      // const perspectiveProjection= mat4.perspective(fov, aspect, zNear,zFar);
      if (usePerspective) {
        matrixStack.perspective(fov, aspect, zNear, zFar);
      } else {
        matrixStack.ortho(
          -canvas.clientWidth / 2, // left
          canvas.clientWidth / 2, // right
          -canvas.clientHeight / 2, // bottom
          canvas.clientHeight / 2, // top
          400, // near
          -400
        );
      }
      matrixStack.lookAt([cx, cy, cz], [0, 0, 0], [upX, upY, upZ]);

      uniformValues.set(matrixStack.getCurrMatrix());
      device.queue.writeBuffer(uniformBuffer, 0, uniformValues);
      pass.setBindGroup(0, bindGroup);

      //teapot
      pass.setVertexBuffer(0, teapotVertexBuffer);
      pass.setIndexBuffer(teapotIndexBuffer,"uint16" )
      device.queue.writeBuffer(teapotVertexBuffer, 0, teapotVertexData);
      device.queue.writeBuffer(teapotIndexBuffer, 0, teapotIndexData);
      pass.drawIndexed(teapotNumIndices);


      //cubic
      pass.setVertexBuffer(0, cubicVertexBuffer);
      pass.setIndexBuffer(cubicIndexBuffer, "uint16");
      device.queue.writeBuffer(cubicVertexBuffer, 0, cubicVertexData);
      device.queue.writeBuffer(cubicIndexBuffer, 0, cubicIndexData);
      // pass.drawIndexed(cubicNumIndices);

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
