import shader from "./shader/shader.wgsl?raw";
import lightShader from "./shader/lightShader.wgsl?raw";

import { IEnviroment } from "../interface";
import { MatrixStack } from "./object/stack";
import { createSphere } from "../utils/sphere";
export default function render({ rotateY, lightX, lightZ, lightY, lightColor, objectColor }: {
  lightColor:number[],
  objectColor:number[],
  rotateY: number,
  lightX:number,
  lightZ:number,
  lightY:number
}) {
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
            arrayStride: 4 * 6, // (3) floats 4 bytes each + one 4 byte color
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" }, // position
              { shaderLocation: 1, offset:12, format:'float32x3'},//normal
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
    const { vertex_normalData, indexData, numIndices, } = createSphere(150,20,20);
    const vertexBuffer = device.createBuffer({
      label: "sphere vertices",
      size: vertex_normalData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertex_normalData);

    const indexBuffer = device.createBuffer({
      label: "indices",
      size: indexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(indexBuffer, 0, indexData);

    const sphereColorBuffer = device.createBuffer({
      label: "sphere color buffer",
      size: colorBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  
    const sphereColorValue = new Float32Array([...objectColor, 1]);
    
    device.queue.writeBuffer(sphereColorBuffer, 0, sphereColorValue);
  
    const objectBindGroup = device.createBindGroup({
      label: "bind group for object",
      layout: pipeline.getBindGroupLayout(1),
      entries: [{ binding: 0, resource: { buffer: sphereColorBuffer } },

      ],
    });

    const lightColorBuffer = device.createBuffer({
      label:'light color buffer',
      size:colorBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
    const lightColorValue = new Float32Array([...lightColor, 1]);
    device.queue.writeBuffer(lightColorBuffer, 0, lightColorValue);


    const lightMatrixBuffer = device.createBuffer({
      label:'light position buffer',
      size: 16 * 4,
      usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const lightMatrix = new MatrixStack();
    lightMatrix.translate([lightX,lightY,lightZ]);
    device.queue.writeBuffer(lightMatrixBuffer,0,lightMatrix.getCurrMatrix());


    const lightBindGroupMain = device.createBindGroup({
      label: 'bind group for light',
      layout: pipeline.getBindGroupLayout(2),
      entries: [{binding:0, resource:{buffer:lightColorBuffer}},
      {binding:1, resource:{buffer:lightMatrixBuffer}}
      ]
    })



    //view matrix uniform
    const uniformBufferSize = 16 * 4;
    const perspectiveBuffer = device.createBuffer({
      label: "uniform",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const viewMatrixBindGroupMain = device.createBindGroup({
      label: "bind group for view main",
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: perspectiveBuffer } }],
    });

 
    const clearColor = { r: 0, g: 0, b: 0, a: 1.0 };
    // main render pass
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
    const viewMatrixStack = new MatrixStack();

    // create a light source and render it in a different pass
    // render the light source
    const {vertexData:lightVertexData, indexData:lightIndexData, numIndices:lightNumIndices} = createSphere(10,2,2);
    const lightVertexBuffer = device.createBuffer({
      label: "light vertices",
      size: lightVertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(lightVertexBuffer, 0, lightVertexData);

    const lightIndexBuffer = device.createBuffer({
      label: "indices",
      size: indexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(lightIndexBuffer, 0, lightIndexData);

    //TODO:
    // position, color

    // light render pass
    const lightRenderPassDescriptor = {
      label: "render pass for light",
      colorAttachments: [
        {
          loadOp: "load",
          storeOp: "store",
          // clearValue: clearColor,
          view: undefined as unknown as GPUTextureView,
        },
      ],

      // depthStencilAttachment: {
      //   depthClearValue: 1.0,
      //   depthLoadOp: "clear",
      //   depthStoreOp: "store",
      //   view: undefined as unknown as GPUTextureView,
      // },
    };

    const lightModule = device.createShaderModule({
      label: "a basic shader",
      code: lightShader,
    });
   
      // light pipeline
      const lightPipeline = device.createRenderPipeline({
        label: "light render pipeline",
        layout: "auto",
        vertex: {
          module:lightModule,
          entryPoint: "vs",
          buffers: [
            {
              arrayStride: 4 * 3, // (3) floats 4 bytes each
              attributes: [
                { shaderLocation: 0, offset: 0, format: "float32x3" }, // position
                // { shaderLocation: 1, offset:12, format:'float32x3'},//normal
              ],
            },
          ],
        },
        fragment: {
          module:lightModule,
          entryPoint: "fs",
          targets: [{ format: presentationFormat }],
        },
        primitive: {
          cullMode: "none",
        },
        // depthStencil: {
        //   depthWriteEnabled: true,
        //   depthCompare: "less",
        //   format: "depth24plus",
        // },
      });

      const lightBindGroupLight = device.createBindGroup({
        label: 'bind group for light',
        layout: lightPipeline.getBindGroupLayout(1),
        entries: [{binding:0, resource:{buffer:lightColorBuffer}},
        {binding:1, resource:{buffer:lightMatrixBuffer}}
        ]
      })
      const viewMatrixBindGroupLight = device.createBindGroup({
        label: "bind group for view light",
        layout: lightPipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: perspectiveBuffer } }],
      });

    return function render() {

       //the sequence of scale, rotation and translate matters!
       viewMatrixStack.rotateY(rotateY);
       viewMatrixStack.ortho(
         -canvas.clientWidth / 2,
         canvas.clientWidth / 2,
         -canvas.clientHeight / 2,
         canvas.clientHeight / 2,
         -400,
         400
       );
       const perspectiveValue = new Float32Array(viewMatrixStack.getCurrMatrix());
       device.queue.writeBuffer(perspectiveBuffer, 0, perspectiveValue);

      //view必须在创建context时动态render
      const canvasTexture = context.getCurrentTexture();
      renderPassDescriptor.colorAttachments[0].view =
        canvasTexture.createView();

      lightRenderPassDescriptor.colorAttachments[0].view =
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

      //set up encoder
      const encoder = device?.createCommandEncoder();

      // render pass setup
      renderPassDescriptor.depthStencilAttachment.view =
        depthTexture.createView();

      // main render pass
      const pass = encoder?.beginRenderPass(
        renderPassDescriptor as GPURenderPassDescriptor
      );
         // light render pass
    
      if (!pass || !encoder) {
        return;
      }
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, viewMatrixBindGroupMain);
      pass.setBindGroup(1, objectBindGroup);
      pass.setBindGroup(2, lightBindGroupMain)
      pass.setVertexBuffer(0, vertexBuffer);
      pass.setIndexBuffer(indexBuffer, "uint16");
      pass.drawIndexed(numIndices);
      pass.end();

      const lightPass = encoder?.beginRenderPass(
        lightRenderPassDescriptor as GPURenderPassDescriptor
      );

      if(!lightPass){return}
   
      lightPass.setPipeline(lightPipeline);
      lightPass.setBindGroup(0, viewMatrixBindGroupLight);
      lightPass.setBindGroup(1, lightBindGroupLight);
      lightPass.setVertexBuffer(0, lightVertexBuffer);
      lightPass.setIndexBuffer(lightIndexBuffer, "uint16");
      lightPass.drawIndexed(lightNumIndices);
      lightPass.end();

      const commandBuffer = encoder.finish();
      device?.queue.submit([commandBuffer]);
    };
  };
}
