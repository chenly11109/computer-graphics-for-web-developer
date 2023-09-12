import shader from "./shader/shader.wgsl?raw";
// import { createCubic } from "./object/object";
import { IEnviroment } from "../interface";
import { MatrixStack } from "./object/stack";
import { createTeapot } from "./object/teaport";

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
}: { usePerspective: boolean } & { [key: string]: number }) {
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
        cullMode: "none",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    });

    //初始化data(vertex, color, etc.)
    // const { cubicVertexData, cubicNumVertices } = createCubic();
    // const cubicVertexBuffer = device.createBuffer({
    //   label: "plan buffer vertices",
    //   size: cubicVertexData.byteLength,
    //   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    // });
    // device.queue.writeBuffer(cubicVertexBuffer, 0, cubicVertexData);

    const {vertexData:teapotVertexData, numVertices:teapotNumVertices} = createTeapot();
    const teapotVertexBuffer = device.createBuffer({
      label:'teapot vertices',
      size:teapotVertexData.byteLength,
      usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
  
    device.queue.writeBuffer(teapotVertexBuffer, 0, teapotVertexData);

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
      pass.setVertexBuffer(0, teapotVertexBuffer);

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
      matrixStack.scale([10,10,10]);
      matrixStack.translate([tx, ty, tz]);

      uniformValues.set(matrixStack.getCurrMatrix());
      device.queue.writeBuffer(uniformBuffer, 0, uniformValues);

      pass.setBindGroup(0, bindGroup);
      pass.draw(teapotNumVertices);
      pass.end();

      const commandBuffer = encoder.finish();
      device?.queue.submit([commandBuffer]);
    };
  };
}
