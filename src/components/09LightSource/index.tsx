import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { Link } from 'react-router-dom';

function LightSourcesExplanation() {
    return (
        <section className="max-w-4xl pb-4 mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-6">
            <h1 className="text-3xl font-semibold text-gray-900 my-4">Types of Light Sources in the context</h1>
            <Link className="text-blue-500 hover:text-blue-700 my-4 font-semibold underline" to="/webgpu/07Diffuse">
                Demo
            </Link>
            <p className="text-gray-600 mt-2">In the previous two sections, we introduce two types of light that could inteact with the object based on a simutation formular (diffuse light and specular light).
                In this seciton, we will introduce another three different light. Each type of light affects the scene differently.
            </p>


            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Point Light</h2>
            <p className="text-gray-700 text-lg">
                Point light emits light uniformly in all directions from a single point in space. It resembles the behavior of a bare light bulb.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4">
                <li><strong>Position:</strong> The specific location in 3D space from which the light originates.</li>
                <li><strong>Intensity:</strong> The brightness of the light, which may attenuate with distance.</li>
                <li><strong>Attenuation:</strong> The decrease in light intensity as the distance from the source increases, usually modeled with linear, quadratic, and constant terms.</li>
            </ul>
            <BlockMath
                math={`\\text{color}_{\\text{diffuse}} = I_{\\text{light}} \\times (\\vec{n} \\cdot \\vec{l}) \\times k_{\\text{diffuse}}`}
            />
            <BlockMath
                math={`\\text{attenuation} = \\frac{1}{k_{c} + k_{l}d + k_{q}d^2}`}
            />
            <p className="text-gray-700 text-lg">
                Here, <InlineMath math={`(\\vec{n})`} /> is the normal vector, <InlineMath math={`(\\vec{l})`} /> is the vector towards the light, <InlineMath math={`(I_{\\text{light}})`} /> is the light's intensity,<InlineMath math={` k_{\\text{diffuse}} `} /> is the diffuse coefficient, and <InlineMath math={` k_c, k_l, k_q `} /> are the attenuation coefficients.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Directional Light</h2>
            <p className="text-gray-700 text-lg">
                Directional light simulates light from a source that is infinitely far away, such as the sun. All rays from a directional light are parallel, and there is no attenuation with distance.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4">
                <li><strong>Direction:</strong> The uniform direction in which the light rays travel across the entire scene.</li>
                <li><strong>Intensity:</strong> The brightness of the light, consistent across all distances.</li>
            </ul>

            <BlockMath
                math={`\\text{color}_{\\text{diffuse}} = I_{\\text{light}} \\times (\\vec{n} \\cdot \\vec{l}) \\times k_{\\text{diffuse}}`}
            />
            <p className="text-gray-700 text-lg">
                With <InlineMath math={`( \\vec{l} )`} /> being the uniform light direction, and <InlineMath math={`( I_{\\text{light}} )`} /> and <InlineMath math={`( k_{\\text{diffuse}} )`} /> similar to those in the point light formula.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Ambient Light</h2>
            <p className="text-gray-700 text-lg">
                Ambient light is a non-directional light that illuminates all parts of a scene uniformly, without any shadows, mimicking the light that has been scattered by the environment.
            </p>


            <BlockMath
                math="\text{color}_{\text{ambient}} = k_{\text{ambient}} \times I_{\text{ambient}}"
            />
            <p className="text-gray-700 text-lg">
                Where <InlineMath math={`(k_{ambient})`} /> is the ambient reflectivity coefficient, and <InlineMath math={`(I_{ambient})`} /> is the intensity of the ambient light.
            </p>
        </section>
    );
}

export default LightSourcesExplanation;
