import { Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function Transformation3D() {
    return (
        <section className="max-w-4xl pb-4 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-900 my-4">Transformation 3D</h1>
            <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/03transformation3D">
                Demo
            </Link>
            <p className="text-gray-600 mt-2">Dive into the demo to explore 3D transformations within the WebGPU environment. Locate the corresponding code examples in the WebGPU folder and enhance your understanding of 3D graphics processing 😉.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Transformations in 3D Graphics</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>
                    <strong>Scale Transformation:</strong> Modifies the size of 3D objects. It involves scaling along the x, y, and z axes, which can be independently adjusted to stretch or compress objects in 3D.
                    <ul className="mt-2">
                        <li>The scaling matrix in 3D is:
                            <InlineMath math={`\\begin{bmatrix} s_x & 0 & 0 \\\\ 0 & s_y & 0 \\\\ 0 & 0 & s_z \\end{bmatrix}`} />
                            where <InlineMath math={`s_x, s_y,`} /> and <InlineMath math={`s_z`} /> are the scaling factors for each axis.
                        </li>
                    </ul>
                </li>
                <li className="font-bold">Rotation Matrices</li>
                <ul>
                    <ul>Rotation around the X-axis:</ul>
                    <BlockMath math={`R_x(\\theta_x) = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & \\cos(\\theta_x) & -\\sin(\\theta_x) \\\\ 0 & \\sin(\\theta_x) & \\cos(\\theta_x) \\end{bmatrix}`} />
                </ul>
                <ul>
                    <ul>Rotation around the Y-axis:</ul>
                    <BlockMath math={`R_y(\\theta_y) = \\begin{bmatrix} \\cos(\\theta_y) & 0 & \\sin(\\theta_y) \\\\ 0 & 1 & 0 \\\\ -\\sin(\\theta_y) & 0 & \\cos(\\theta_y) \\end{bmatrix}`} />
                </ul>
                <ul>
                    <ul>Rotation around the Z-axis:</ul>
                    <BlockMath math={`R_z(\\theta_z) = \\begin{bmatrix} \\cos(\\theta_z) & -\\sin(\\theta_z) & 0 \\\\ \\sin(\\theta_z) & \\cos(\\theta_z) & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}`} />
                </ul>


                <li>
                    <strong>Translation Transformation:</strong> Translates or moves objects along the x, y, and z axes.
                    <ul className="mt-2">
                        <li>The translation matrix in 3D includes:
                            <InlineMath math={`\\begin{bmatrix} 1 & 0 & 0 & t_x \\\\ 0 & 1 & 0 & t_y \\\\ 0 & 0 & 1 & t_z \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}`} />
                            where <InlineMath math={`t_x, t_y,`} /> and <InlineMath math={`t_z`} /> are the distances moved along each axis.
                        </li>
                    </ul>
                </li>

                <h2 className="text-2xl font-semibold text-gray-900 my-4">Composite 3D Transformation Matrix</h2>
                <p className="text-gray-600 mt-2">The following matrix represents the combination of scaling, rotation, and translation transformations:</p>

                <BlockMath math={`M = T \\cdot R_z(\\theta_z) \\cdot R_y(\\theta_y) \\cdot R_x(\\theta_x) \\cdot S`} />
                <p>Where:</p>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                    <li><strong>S</strong> is the scaling matrix.</li>
                    <li><strong><InlineMath math={`R_x(\\theta_x)`} /></strong>, <strong><InlineMath math={`R_y(\\theta_y)`} /></strong>, <strong><InlineMath math={`R_z(\\theta_z)`} /></strong> are the rotation matrices around the x, y, and z axes, respectively.</li>
                    <li><strong>T</strong> is the translation matrix given by:
                        <BlockMath math={`\\begin{bmatrix} 1 & 0 & 0 & t_x \\\\ 0 & 1 & 0 & t_y \\\\ 0 & 0 & 1 & t_z \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}`} />
                        where <InlineMath math={` t_x, t_y, `} /> and <InlineMath math={` t_z `} /> are the translation distances along the x, y, and z axes, respectively.
                    </li>
                </ul>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Orthographic Projection Matrix</h2>
            <p className="text-gray-700 text-lg">The orthographic projection matrix is used to project 3D objects onto a 2D screen without perspective distortion. This is particularly useful for CAD applications and 2D rendering of 3D scenes where maintaining the object's dimensions is critical. Here's the matrix setup based on the given canvas dimensions:</p>
            <BlockMath
                math={`P = \\begin{bmatrix} \\frac{2}{right - left} & 0 & 0 & -\\frac{right + left}{right - left} \\\\ 0 & \\frac{2}{top - bottom} & 0 & -\\frac{top + bottom}{top - bottom} \\\\ 0 & 0 & -\\frac{2}{far - near} & -\\frac{far + near}{far - near} \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}`}
            />
            <p className="text-gray-700 mt-4">
                Here, <strong>left</strong>, <strong>right</strong>, <strong>bottom</strong>, and <strong>top</strong> describe the clipping planes of the viewport, while <strong>near</strong> and <strong>far</strong> define the depth boundaries of the scene.
            </p>



            <h2 className="text-2xl font-semibold text-gray-900 mt-6">Advanced 3D Techniques</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li><strong>Depth Buffering:</strong> Critical for rendering layers in 3D space, ensuring that objects closer to the viewer occlude those that are further away.</li>
                <li><strong>Blending and Transparency:</strong> Techniques that manage how overlapping objects blend their colors based on transparency.</li>
            </ul>
        </section>
    );
}
