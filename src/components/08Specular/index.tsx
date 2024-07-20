import 'katex/dist/katex.min.css';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from 'react-katex';

function SpecularReflection() {
    return (
        <section className="max-w-4xl pb-4 mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-6">
            <h1 className="text-3xl font-semibold text-gray-900 my-4">Specular Reflection</h1>
            <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/07Diffuse">
                Demo
            </Link>
            <p className="text-gray-600 mt-2">Specular reflection is an essential component of rendering realistic-looking surfaces, representing the bright spot of light that appears on shiny surfaces when illuminated.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Mathematical Formula for Specular Reflection</h2>
            <p className="text-gray-700 text-lg">
                The Phong reflection model is commonly used to approximate the way light interacts with surfaces in 3D graphics, incorporating specular reflection as follows:
            </p>

            <BlockMath
                math={`I_{spec} = k_{spec} \\cdot I_{light} \\cdot \\max(\\cos(\\theta), 0)^n`}
            />

            <ul className="list-disc list-inside text-gray-700 mt-4">
                <li><strong>
                    <InlineMath math={`I_{spec}`} />
                </strong>: Intensity of the specular reflection.</li>
                <li><strong>
                    <InlineMath math={`k_{spec}`} />
                </strong>: Specular reflectivity of the material.</li>
                <li><strong>
                    <InlineMath math={`I_{light}`} />
                </strong>: Intensity of the incoming light.</li>
                <li><strong>cos(θ)</strong>: Cosine of the angle between the reflection vector and the view direction.</li>
                <li><strong>n</strong>: Shininess coefficient of the material, controlling the focus of the specular highlight.</li>
            </ul>
            <p className="text-gray-600 mt-2">
                This model effectively simulates the light reflection behavior observed in real-world scenarios where surfaces show varying degrees of shininess based on the material properties.
            </p>

            <a className='text-' href="http://learnwebgl.brown37.net/09_lights/lights_specular.html">Implementation of specular light in WebGL</a>
        </section>
    );
}

export default SpecularReflection;
