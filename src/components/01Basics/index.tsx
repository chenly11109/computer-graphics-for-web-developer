import { Link } from "react-router-dom";

export default function Basics() {
    return <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-900 my-4">Building a Basic Render Pipeline</h1>

        <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/01basics">Check out the Demo</Link>
        <p className="text-gray-600 mt-2">Explore the demo link and locate the corresponding code example in the WebGPU folder 😉.</p>

        <p className="text-gray-600 mt-2">Sets up a basic rendering pipeline using WebGPU, handling shaders, vertex data, and the drawing process.</p>



        <h2 className="text-xl text-gray-800 mt-5">What is WebGPU?</h2>
        <p className="text-gray-600 mt-2">WebGPU provides modern features for high-performance, low-level graphics and computation on the web. It bridges the capabilities of GPU hardware with web applications.</p>

        <h2 className="text-xl text-gray-800 mt-5">Setup and Configuration</h2>
        <p className="text-gray-600 mt-2">To start, you need a compatible GPU device and a graphical context. The configuration also involves setting up the presentation format, via <code className="bg-gray-100 text-red-600 p-1 rounded">IEnvironment</code> interface that holds this essential setup information.</p>

        <h2 className="text-xl text-gray-800 mt-5">Shader Module Creation</h2>
        <p className="text-gray-600 mt-2">Shaders are programs run on the GPU. You need to create shader modules using the WebGPU Shading Language (WGSL) to define these programs. This code will determine how your app processes graphics and computations.</p>

        <h2 className="text-xl text-gray-800 mt-5">Render Pipeline</h2>
        <p className="text-gray-600 mt-2">The render pipeline is crucial; it orchestrates how input data (like vertices) transforms into pixels on the screen. It involves stages like vertex shading and fragment shading, which are defined in the shaders.</p>

        <h2 className="text-xl text-gray-800 mt-5">Data Management: Buffers and Arrays</h2>
        <p className="text-gray-600 mt-2">Data in WebGPU is managed through buffers. These buffers store data like vertex coordinates and colors in typed arrays, which are then mapped to the GPU for rendering operations.</p>

        <h2 className="text-xl text-gray-800 mt-5">Rendering Process: From Start to Finish</h2>
        <p className="text-gray-600 mt-2">Rendering involves initiating a render pass, setting up pipelines, binding buffers, and drawing. This process is what ultimately produces the visual output on your display from the provided data.</p>


    </section>
}
