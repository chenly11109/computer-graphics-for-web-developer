import shader from "./shader/shader.wgsl?raw";
// import { createCubic } from "./object/object";
import { IEnviroment } from "../interface";
import { MatrixStack } from "./object/stack";
import { createTeapot } from "./object/teaport";
import { createCubicIndices } from "./object/object";
import { createPlan } from "./object/plan";

export default function render({
  rotateX,
  rotateY,
  tx,
  ty,
  tz,
  fov,
  zNear,
  zFar,
  imageBitMap
}: { imageBitMap: ImageBitmap } & { [key: string]: number }) {

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

    const objectTypeBufferSize = 16;

    //object type 1 = cubic & teapot
    const objectTypeBuffer = device.createBuffer({
      label: 'object type buffer1',
      size: objectTypeBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const objectTypeBindGroup = device.createBindGroup({
      label: 'bind group for teapot type',
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0, resource: { buffer: objectTypeBuffer }
      }]
    })
    device.queue.writeBuffer(objectTypeBuffer, 0, new Uint32Array([1]));


    // object type 0 = plan
    const objectTypeBuffer2 = device.createBuffer({
      label: 'object type buffer2',
      size: objectTypeBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const objectType2BindGroup = device.createBindGroup({
      label: 'bind group for plan type',
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: objectTypeBuffer2 } }]
    })
    device.queue.writeBuffer(objectTypeBuffer2, 0, new Uint32Array([0]));


    //objectInfo - cubic*4 + teapot
    //vertexBuffer
    //indexBuffer
    //attrBindgroup (color, viewMatrix)
    //transformMatrix
    const objects1Info: { vertexBuffer: GPUBuffer; indexBuffer: GPUBuffer; numIndices: number; attrBindGroup: GPUBindGroup; }[] = [];
    const colorBufferSize = 16;
    const transformBufferSize = 16 * 4;

    //teapot 
    const { vertexData: teapotVertexData, indexData: teapotIndexData, numIndices: teapotNumIndices } = createTeapot();
    const teapotVertexBuffer = device.createBuffer({
      label: 'teapot vertices',
      size: teapotVertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(teapotVertexBuffer, 0, teapotVertexData);

    const teapotIndexBuffer = device.createBuffer({
      label: 'teapot indices',
      size: teapotIndexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(teapotIndexBuffer, 0, teapotIndexData);

    const teapotColorBuffer = device.createBuffer({
      label: 'teapot color buffer',
      size: colorBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const teapotColorValue = new Float32Array([0, 1, 1, 1]);
    device.queue.writeBuffer(teapotColorBuffer, 0, teapotColorValue);

    const teapotTransformBuffer = device.createBuffer({
      label: 'teapot transform buffer',
      size: transformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const teapotMatrixStack = new MatrixStack();
    const teapotTransformValue = new Float32Array(teapotMatrixStack.getCurrMatrix());
    device.queue.writeBuffer(teapotTransformBuffer, 0, teapotTransformValue);

    const teapotBindGroup = device.createBindGroup({
      label: 'bind group for teapot',
      layout: pipeline.getBindGroupLayout(3),
      entries: [
        { binding: 0, resource: { buffer: teapotColorBuffer } },
        { binding: 1, resource: { buffer: teapotTransformBuffer } },
      ],
    });

    objects1Info.push({
      vertexBuffer: teapotVertexBuffer,
      indexBuffer: teapotIndexBuffer,
      numIndices: teapotNumIndices,
      attrBindGroup: teapotBindGroup
    })

    //cubics * 4
    const { cubicIndexData, cubicNumIndices, cubicVertexData } = createCubicIndices();
    const cubicVertexBuffer = device.createBuffer({
      label: 'cubic vertices',
      size: cubicVertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(cubicVertexBuffer, 0, cubicVertexData);
    const cubicIndexBuffer = device.createBuffer({
      label: 'cubic indices',
      size: cubicIndexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(cubicIndexBuffer, 0, cubicIndexData);

    [0, 1, 2, 3].forEach(index => {
      const cubicTransformBuffer = device.createBuffer({
        label: 'cubic transform buffer',
        size: transformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
      const cubicMatrixStack = new MatrixStack();
      cubicMatrixStack.translate([(index % 2 - 0.5) * 10, 1, (Math.floor(index / 2) - 0.5) * 10])
      cubicMatrixStack.scale([0.2, 1, 0.2]);
      const cubicTransformValue = new Float32Array(cubicMatrixStack.getCurrMatrix());
      device.queue.writeBuffer(cubicTransformBuffer, 0, cubicTransformValue);


      const cubicColorBuffer = device.createBuffer({
        label: 'teapot color buffer',
        size: colorBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
      const cubicColorValue = new Float32Array([1 - 0.3 * index, 0, 0.3 * index, 1]);
      device.queue.writeBuffer(cubicColorBuffer, 0, cubicColorValue);

      const cubicBindGroup = device.createBindGroup({
        label: 'bind group for cubic',
        layout: pipeline.getBindGroupLayout(3),
        entries: [
          { binding: 0, resource: { buffer: cubicColorBuffer } },
          { binding: 1, resource: { buffer: cubicTransformBuffer } },
        ],
      });

      objects1Info.push({
        vertexBuffer: cubicVertexBuffer,
        indexBuffer: cubicIndexBuffer,
        numIndices: cubicNumIndices,
        attrBindGroup: cubicBindGroup
      })
    })


    //plan
    const { planNumIndices, planVertexData, planIndexData } = createPlan();
    const planVertexBuffer = device.createBuffer({
      label: 'plan vertices',
      size: planVertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    const planIndexBuffer = device.createBuffer({
      label: 'plan index',
      size: planIndexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })

    device.queue.writeBuffer(planVertexBuffer, 0, planVertexData);
    device.queue.writeBuffer(planIndexBuffer, 0, planIndexData);



    //planTexture
    const planTexture = device.createTexture({
      size: [imageBitMap.width, imageBitMap.height, 1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    })
    device.queue.copyExternalImageToTexture(
      { source: imageBitMap },
      { texture: planTexture },
      [imageBitMap.width, imageBitMap.height]
    );


    const samplerDescriptor: GPUSamplerDescriptor = {
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
      magFilter: 'nearest',
      minFilter: 'nearest',
    }


    const sampler = device.createSampler(samplerDescriptor);


    const textureBindGroup = device.createBindGroup({
      label: "bind group for texture",
      layout: pipeline.getBindGroupLayout(1),
      entries: [
        { binding: 1, resource: sampler },
        { binding: 2, resource: planTexture.createView() }
      ],
    });

    const planTransformBuffer = device.createBuffer({
      label: 'teapot transform buffer',
      size: transformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const planMatrixStack = new MatrixStack();
    planMatrixStack.scale([3, 3, 3])
    const planTransformValue = new Float32Array(planMatrixStack.getCurrMatrix());
    device.queue.writeBuffer(planTransformBuffer, 0, planTransformValue);

    const planBindGroup = device.createBindGroup({
      label: 'bind group for plan',
      layout: pipeline.getBindGroupLayout(3),
      entries: [
        { binding: 0, resource: { buffer: teapotColorBuffer } },
        { binding: 1, resource: { buffer: planTransformBuffer } },
      ],
    });


    //view matrix uniform
    const uniformBufferSize = 16 * 4;
    const perspectiveBuffer = device.createBuffer({
      label: "uniform",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const cameraBuffer = device.createBuffer({
      label: "uniform",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const viewMatrixBindGroup = device.createBindGroup({
      label: 'bind group for view',
      layout: pipeline.getBindGroupLayout(2),
      entries: [{ binding: 0, resource: { buffer: perspectiveBuffer } },
      { binding: 1, resource: { buffer: cameraBuffer } }
      ]
    })

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
      pass.setBindGroup(1, textureBindGroup);


      //the sequence of scale, rotation and translate matters!
      matrixStack.scale([20, 20, 20]);
      matrixStack.translate([tx, ty, tz]);
      //width/height
      const aspect = canvas.clientWidth / canvas.clientHeight;
      matrixStack.perspective(fov, aspect, zNear, zFar);
      const perspectiveValue = new Float32Array(matrixStack.getCurrMatrix());
      device.queue.writeBuffer(perspectiveBuffer, 0, perspectiveValue);

      const cameraMatrixStack = new MatrixStack();
      //camera rotation
      cameraMatrixStack.rotateY(rotateY);
      cameraMatrixStack.rotateX(rotateX);

      cameraMatrixStack.lookAt([0, 0, 500], [0, 0, -400], [0, 1, 0]);



      const cameraValue = new Float32Array(cameraMatrixStack.getCurrMatrix());
      device.queue.writeBuffer(cameraBuffer, 0, cameraValue);

      pass.setBindGroup(2, viewMatrixBindGroup);

      pass.setBindGroup(0, objectTypeBindGroup);
      objects1Info.forEach(({ vertexBuffer, indexBuffer, numIndices, attrBindGroup }) => {
        pass.setBindGroup(3, attrBindGroup);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.setIndexBuffer(indexBuffer, "uint16");
        pass.drawIndexed(numIndices)
      })

      //plan
      pass.setBindGroup(0, objectType2BindGroup);
      pass.setVertexBuffer(0, planVertexBuffer);
      pass.setIndexBuffer(planIndexBuffer, "uint16");
      pass.setBindGroup(3, planBindGroup);
      pass.drawIndexed(planNumIndices);

      pass.end();

      const commandBuffer = encoder.finish();
      device?.queue.submit([commandBuffer]);
    };
  };
}
