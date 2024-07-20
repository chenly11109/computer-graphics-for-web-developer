import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Link } from 'react-router-dom';

function PerspectiveProjectionMatrices() {
    return (
        <section className="max-w-4xl pb-4 mx-auto px-4 sm:px-6 lg:px-8  bg-white shadow-lg rounded-lg my-6">
            <h1 className="text-3xl font-semibold text-gray-900 my-4">Perspective</h1>
            <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/04perspective">Demo</Link>
            <p className="text-gray-600 mt-2">Explore the demo link and locate the corresponding code example in the WebGPU folder 😉.</p>

            <p className="text-gray-600 mt-2">
                The code dynamically selects between perspective and frustum projection matrices based on the provided settings.
            </p>



            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Frustum Projection Matrix</h2>
            <p className="text-gray-700 text-lg">
                A frustum is a truncated pyramid with the top cut off by a plane parallel to the base. In graphics, this shape represents the visible volume of space in a 3D scene. Everything inside this volume is rendered on the screen, while objects outside are clipped away.
            </p>


            <BlockMath
                math={`P_{frustum} = \\begin{bmatrix} \\frac{2 \\cdot zNear}{right - left} & 0 & \\frac{right + left}{right - left} & 0 \\\\ 0 & \\frac{2 \\cdot zNear}{top - bottom} & \\frac{top + bottom}{top - bottom} & 0 \\\\ 0 & 0 & -\\frac{zFar + zNear}{zFar - zNear} & -\\frac{2 \\cdot zFar \\cdot zNear}{zFar - zNear} \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}`}
            />

            <ul className="list-disc list-inside text-gray-700 mt-4">
                <li><strong>left, right:</strong> The x-coordinates of the left and right sides of the near clipping plane, respectively. Adjusting these values skews the frustum horizontally.</li>
                <li><strong>bottom, top:</strong> The y-coordinates of the bottom and top sides of the near clipping plane, respectively. These values adjust the vertical skew of the frustum.</li>
                <li><strong>zNear (Near Clipping Plane):</strong> The distance from the viewer to the near clipping plane. Objects closer than this distance are not rendered. It sets the front boundary of the frustum.</li>
                <li><strong>zFar (Far Clipping Plane):</strong> The distance from the viewer to the far clipping plane. Objects beyond this distance are also not rendered. It sets the back boundary of the frustum.</li>
            </ul>
            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Perspective Projection Matrix</h2>
            <p className="text-gray-700 text-lg">
                Perspective projection is a type of projection used to represent an object as it appears to the human eye. It simulates the effect of perspective in viewpoints, where objects look smaller as they are further away, converging towards a vanishing point.            </p>
            <BlockMath
                math={`P_{perspective} = \\begin{bmatrix} \\frac{1}{\\tan(\\frac{fov}{2}) \\cdot aspect} & 0 & 0 & 0 \\\\ 0 & \\frac{1}{\\tan(\\frac{fov}{2})} & 0 & 0 \\\\ 0 & 0 & -\\frac{zFar + zNear}{zFar - zNear} & -\\frac{2 \\cdot zFar \\cdot zNear}{zFar - zNear} \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}`}
            />
            <ul className="list-disc list-inside text-gray-700 mt-4">
                <li><strong>fov (Field of View):</strong> This variable represents the vertical extent of the visible world from the viewer's perspective. It is measured in degrees or radians and directly influences the scale of the z-axis in the projection matrix.</li>
                <li><strong>aspect (Aspect Ratio):</strong> Defined as the ratio of the viewport's width to its height. It ensures that images do not get distorted as they are projected from 3D to 2D. The aspect ratio affects the scaling factor of the x-axis in the matrix.</li>
                <li><strong>zNear (Near Clipping Plane):</strong> The closest distance from the viewer at which a scene is rendered. Objects closer than this distance will not be visible. It helps in managing the rendering process's computational load.</li>
                <li><strong>zFar (Far Clipping Plane):</strong> The furthest distance at which objects are still rendered in the scene. Objects beyond this distance will not be visible, similar to the near plane, it aids in computational efficiency and prevents rendering objects too far to be seen or contribute visually.</li>
            </ul>



        </section>
    );
}

export default PerspectiveProjectionMatrices;
