import { Link } from "react-router-dom";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export default function Transformation2D() {
    return (
        <section className="max-w-4xl pb-4 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-900 my-4">Transformation 2D</h1>
            <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/02transformation2D">
                Demo
            </Link>
            <p className="text-gray-600 mt-2">Explore the demo link and locate the corresponding code example in the WebGPU folder 😉.</p>
            <p className="text-gray-600 mt-2"> set up and render a simple 2D square using WebGPU, managing shaders, buffers, and transformations based on input parameters to display the square with specified scaling, translation, and rotation.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Foundational Concepts in Computer Graphics</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li><strong>Coordinate Systems:</strong> Critical for understanding how graphical data is structured and manipulated. Cartesian coordinates provide a straightforward way to outline 2D or 3D geometry. Homogeneous coordinates are used in matrix operations for transformations.</li>
                <li><strong>Clipping and Culling:</strong> Techniques that enhance performance. Clipping removes parts of scenes outside the viewing area, while culling eliminates back-facing polygons to reduce the number of graphics processed.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Transformations in 2D Graphics</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>
                    <strong>Scale Transformation:</strong> Changes the size of objects. In 2D, this might mean stretching or shrinking along axes. In WebGPU, scale transformations require modifying the transformation matrix.
                    <ul className="mt-2">
                        <li>To scale an object in 2D, you multiply its coordinate matrix by a scaling matrix. The scaling matrix is defined as:
                            <InlineMath math={`\\begin{bmatrix} s_x & 0 \\\\ 0 & s_y \\end{bmatrix}`} />
                            where <InlineMath math={`s_x`} /> and <InlineMath math={`s_y`} /> are the scaling factors along the x and y axes, respectively.
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>Rotation Transformation:</strong> Involves rotating objects around an axis. In 2D transformations, it typically involves rotation around the z-axis. This requires adjusting the transformation matrix to alter the object's orientation.
                    <ul className="mt-2">
                        <li>To rotate an object, you multiply its coordinate matrix by a rotation matrix. For a counterclockwise rotation by an angle <InlineMath math={`\\theta`} />, the rotation matrix is:
                            <InlineMath math={`\\begin{bmatrix} \\cos(\\theta) & -\\sin(\\theta) \\\\ \\sin(\\theta) & \\cos(\\theta) \\end{bmatrix}`} />
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>Translation Transformation:</strong> Moves objects from one position to another, essential for adjusting object placement within a scene.
                    <ul className="mt-2">
                        <li>Translation involves moving an object by adding a constant to its coordinates. The translation matrix, when represented in homogeneous coordinates for compatibility with other transformations, is:
                            <InlineMath math={`\\begin{bmatrix} 1 & 0 & t_x \\\\ 0 & 1 & t_y \\\\ 0 & 0 & 1 \\end{bmatrix}`} />
                            where <InlineMath math={`t_x`} /> and <InlineMath math={`t_y`} /> are the translation distances along the x and y axes.
                        </li>
                    </ul>
                </li>
            </ul>


            <h2 className="text-2xl font-semibold text-gray-900 mt-6">WebGPU Essentials</h2>
            <p className="text-gray-600">Digging deeper into WebGPU's specific functionalities and usage:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li><strong>Bind Groups:</strong> A mechanism in WebGPU for organizing and accessing multiple resources such as buffers and textures within a shader.</li>
                <li><strong>Cull Mode:</strong> A property that defines whether the front or back faces of polygons should be rendered. This is useful for optimizing rendering paths by discarding faces not visible to the camera.</li>
                <li><strong>Memory Layout:</strong> Refers to how data is structured in buffers. Understanding this is crucial for efficient data access and manipulation within shaders.</li>
            </ul>
            <a className="text-blue-500 hover:text-blue-700 underline mt-2" href="https://toji.dev/webgpu-best-practices/bind-groups.html">Learn more about Bind Groups</a>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Interactive UI with Leva</h2>
            <p className="text-gray-600 mt-2">Using the Leva panel for real-time control and adjustment of properties in WebGL applications, enhancing both development speed and usability.</p>
        </section>
    );
}
