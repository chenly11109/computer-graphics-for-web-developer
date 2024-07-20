import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

function WebGPUPerspective() {
    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-6">
            <h1 className="text-3xl font-semibold text-gray-900 my-4">Diffuse Lighting</h1>
            <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/07Diffuse">
                Demo
            </Link>
            <p className="text-gray-600 mt-2">Explore the demo link to see how diffuse lighting works with 3D models in WebGPU. Locate the corresponding code example in the WebGPU folder 😉.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Diffuse Lighting</h2>
            <p className="text-gray-700 text-lg">
                Diffuse lighting in computer graphics simulates the way light scatters when it strikes rough surfaces. This scattering is governed by Lambert's Cosine Law, which states that the brightness of a surface illuminated by a diffuse light source is directly proportional to the cosine of the angle between the surface normal and the direction to the light source. This physical law ensures that surfaces perpendicular to the light appear brightest, while the intensity diminishes as the angle increases towards parallel orientation where no light is visible.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Mathematics of Diffuse Lighting</h2>
            <p className="text-gray-700 text-lg">
                The mathematical foundation of diffuse lighting is based on the dot product of the normalized vectors of the light's direction and the surface's normal. If <InlineMath math="\vec{N}" /> represents the normalized surface normal, and <InlineMath math="\vec{L}" /> represents the normalized light direction, the intensity <InlineMath math="I" /> of the light that affects the color of the surface is calculated as <BlockMath math="I = I_0 \cdot \max(\vec{N} \cdot \vec{L}, 0)" />, where <InlineMath math="I_0" /> is the light's intrinsic intensity.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Fragment Shader in WebGPU</h2>
            <p className="text-gray-700 text-lg">
                In WebGPU, the fragment shader plays a critical role in determining the visual output of 3D graphics by processing interpolated data from vertices to compute pixel colors.
                It handles complex calculations for lighting, texture mapping, and color blending.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Implementation in Shaders</h2>
            <p className="text-gray-700 text-lg">
                The provided code snippet in WGSL (WebGPU Shading Language) shows how to implement these calculations. The vertex shader prepares position and normal data per vertex, while the fragment shader performs the final computation of color based on diffuse lighting principles. This includes normalizing vectors, calculating the dot product for the cosine of the angle, clamping negative values to zero, and multiplying by the color attributes to get the final pixel color that the GPU renders to the screen.
            </p>

            <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-scroll">
                {`@fragment fn fs(fInput : FInput)->@location(0) vec4<f32>{
    var to_light: vec4<f32>;
    var cos_angle: f32;
    var fColor: vec4<f32>;

    to_light = normalize(lightPosition * vec4<f32>(0,0,0,1) - fInput.fragPos);
    cos_angle = dot(fInput.fragNorm, to_light);
    cos_angle = clamp(cos_angle, 0.0, 1.0);
    fColor = vec4(vec3(sColor.rgb) * cos_angle, sColor.a) * lColor;

    return fColor;
}`}
            </pre>
        </section>
    );
}

export default WebGPUPerspective;
