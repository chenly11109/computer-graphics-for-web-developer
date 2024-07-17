// Importing the WGSL shader code and utility functions for creating geometric data
import shader from './shader/shader.wgsl?raw';
import { createPlan } from './object';
import { IEnviroment } from '../interface';

// Main rendering function that uses the WebGPU environment details passed as an argument
export default function render({ device, context, presentationFormat }: IEnviroment) {

  // Creating a shader module with the imported shader code
  const module = device.createShaderModule({
    label: 'a basic shader',
    code: shader
  });

  // Setting up the GPU render pipeline with configurations for both vertex and fragment shaders
  const pipeline = device.createRenderPipeline({
    label: 'render plan',
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vs',  // Vertex shader entry point
      buffers: [
        {
          arrayStride: 3 * 4, // Size of each vertex (3 floats, 4 bytes each)
          attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x2' },  // Vertex position attribute
            { shaderLocation: 1, offset: 8, format: 'unorm8x4' },  // Vertex color attribute
          ],
        },
      ],
    },
    fragment: {
      module,
      entryPoint: 'fs',  // Fragment shader entry point
      targets: [{ format: presentationFormat }],  // Output format based on the display
    },
  });

  // Initializing the vertex data and creating a GPU buffer to store this data
  const { planVertexData, planNumVertices } = createPlan();
  const planVertexBuffer = device.createBuffer({
    label: 'plan buffer vertices',
    size: planVertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST  // Buffer usage for vertices and data copying
  });
  device.queue.writeBuffer(planVertexBuffer, 0, planVertexData);  // Copying vertex data to the GPU buffer

  // Setting up the rendering pass configuration
  const renderPassDescriptor = {
    label: 'render pass',
    colorAttachments: [
      {
        loadOp: 'clear',  // Clearing the framebuffer when the rendering begins
        storeOp: 'store',  // Storing the rendered content after rendering completes
        view: undefined as unknown as GPUTextureView  // Dynamically set later
      }
    ]
  };

  // Returning a render function that gets called to perform rendering
  return function render() {
    // Dynamically setting the texture view before rendering
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
    const encoder = device?.createCommandEncoder();  // Creating a command encoder
    const pass = encoder?.beginRenderPass(renderPassDescriptor as GPURenderPassDescriptor);
    if (!pass || !encoder) { return }  // Check if the encoder or pass is not available and exit
    pass.setPipeline(pipeline);  // Setting the pipeline for this render pass
    pass.setVertexBuffer(0, planVertexBuffer);  // Binding the vertex buffer
    pass.draw(planNumVertices);  // Drawing the vertices
    pass.end();  // Ending the render pass

    const commandBuffer = encoder.finish();  // Finalizing the commands
    device?.queue.submit([commandBuffer]);  // Submitting the commands to the GPU queue for execution
  }
}
