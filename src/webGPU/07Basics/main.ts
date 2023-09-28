import shader from "./shader/shader.wgsl?raw";
import { IEnviroment } from "../interface";
import { MatrixStack } from "./object/stack";
import { createSphere } from "../utils/sphere";
export default function render({ rotateY }: { rotateY: number }) {
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

    const colorBufferSize = 16;

    //sphere
    const { vertexData, indexData, numIndices } = createSphere();
    const vertexBuffer = device.createBuffer({
      label: "sphere vertices",
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertexData);

    const indexBuffer = device.createBuffer({
      label: "indices",
      size: indexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(indexBuffer, 0, indexData);

    const colorBuffer = device.createBuffer({
      label: "color buffer",
      size: colorBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const colorValue = new Float32Array([0, 1, 1, 1]);
    device.queue.writeBuffer(colorBuffer, 0, colorValue);

    const objectBindGroup = device.createBindGroup({
      label: "bind group for object",
      layout: pipeline.getBindGroupLayout(1),
      entries: [{ binding: 0, resource: { buffer: colorBuffer } }],
    });

    //view matrix uniform
    const uniformBufferSize = 16 * 4;
    const perspectiveBuffer = device.createBuffer({
      label: "uniform",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const viewMatrixBindGroup = device.createBindGroup({
      label: "bind group for view",
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: perspectiveBuffer } }],
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

    //uniform view matrix
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

      //the sequence of scale, rotation and translate matters!
      matrixStack.scale([50, 50, 50]);
      matrixStack.rotateY(rotateY);

      matrixStack.ortho(
        -canvas.clientWidth / 2,
        canvas.clientWidth / 2,
        -canvas.clientHeight / 2,
        canvas.clientHeight / 2,
        -400,
        400
      );
      const perspectiveValue = new Float32Array(matrixStack.getCurrMatrix());
      device.queue.writeBuffer(perspectiveBuffer, 0, perspectiveValue);

      pass.setBindGroup(0, viewMatrixBindGroup);

      pass.setBindGroup(1, objectBindGroup);
      pass.setVertexBuffer(0, vertexBuffer);
      pass.setIndexBuffer(indexBuffer, "uint16");
      pass.drawIndexed(numIndices);

      pass.end();

      const commandBuffer = encoder.finish();
      device?.queue.submit([commandBuffer]);
    };
  };
}
