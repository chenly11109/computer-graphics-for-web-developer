// Importing shader code, utility functions, interfaces, and matrix operations
import shader from './shader/shader.wgsl?raw';
import { createSquare } from './object';
import { IEnviroment } from '../interface';
import { mat3 } from './mat';

// Main render function definition
export default function render({ scaleX, scaleY, translationX, translationY, rotation }: { [key: string]: number }) {
  // Return a function that takes the environment settings as parameters
  return function ({ device, context, presentationFormat, canvas }: IEnviroment) {
    // Create a shader module from the imported shader code
    const module = device.createShaderModule({
      label: 'a basic shader',
      code: shader
    });

    // Initialize the GPU shader pipeline with vertex and fragment shaders
    const pipeline = device.createRenderPipeline({
      label: 'render plan',
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs',
        buffers: [
          {
            arrayStride: (3) * 4, // 2 positions (floats) and 1 color (4 bytes)
            attributes: [
              { shaderLocation: 0, offset: 0, format: 'float32x2' },  // Position attribute
              { shaderLocation: 1, offset: 8, format: 'unorm8x4' },  // Color attribute
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

    // Define the uniform buffer size and create the buffer
    const uniformBufferSize = (12 + 4) * 4; // Matrix (12 floats) + padding (4 floats)
    const uniformBuffer = device.createBuffer({
      label: 'uniforms',
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    // Set up the uniform values and bind group for shaders
    const uniformValues = new Float32Array(uniformBufferSize / 4);
    const bindGroup = device.createBindGroup({
      label: 'bind group for transformation',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } }
      ]
    });

    // Initialize vertex data and create a buffer for it
    const { squareVertexData, squareNumVertices } = createSquare();
    const squareVertexBuffer = device.createBuffer({
      label: 'plan buffer vertices',
      size: squareVertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    // Write vertex data to the buffer
    device.queue.writeBuffer(squareVertexBuffer, 0, squareVertexData);

    // Define the render pass descriptor
    const renderPassDescriptor = {
      label: 'render pass',
      colorAttachments: [
        {
          clearValue: [0, 0, 0, 1],
          loadOp: 'clear',
          storeOp: 'store',
          view: undefined as unknown as GPUTextureView
        }
      ]
    };

    // Return the function that handles actual rendering
    return function render() {
      // Set the view for color attachments dynamically based on the current texture
      renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
      const encoder = device?.createCommandEncoder();
      const pass = encoder?.beginRenderPass(renderPassDescriptor as GPURenderPassDescriptor);
      if (!pass || !encoder) { return }
      pass.setPipeline(pipeline);
      pass.setVertexBuffer(0, squareVertexBuffer);

      // Calculate transformation matrices and set up the matrix uniform
      const projectionMatrix = mat3.projection(canvas.clientWidth, canvas.clientHeight);
      const translationMatrix = mat3.translation([translationX, translationY]);
      const scaleMatrix = mat3.scaling([scaleX, scaleY]);
      const rotationMatrix = mat3.rotation(rotation);
      const matrixTemp = mat3.multiply(rotationMatrix, scaleMatrix);
      const matrixTemp2 = mat3.multiply(translationMatrix, matrixTemp);
      const matrix = mat3.multiply(projectionMatrix, matrixTemp2);
      const matrix4 = [...matrix.slice(0, 3), 0, ...matrix.slice(3, 6), 0, 0, 0, 1, 0, ...matrix.slice(6, 9), 1];
      uniformValues.set(matrix4);
      device.queue.writeBuffer(uniformBuffer, 0, uniformValues);
      pass.setBindGroup(0, bindGroup);

      // Draw the square and end the pass
      pass.draw(squareNumVertices);
      pass.end();

      // Submit the commands for execution
      const commandBuffer = encoder.finish();
      device?.queue.submit([commandBuffer]);
    }
  }
}
