import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { Link } from 'react-router-dom';

export default function Camera() {
    return <section className="pb-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-6">
        <h1 className="text-3xl font-semibold text-gray-900 my-4">Camera(View) Matrix</h1>

        <div className='flex flex-col gap-2'>
            <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/05Camera">Demo</Link>

            <p className="text-gray-600">Explore the demo link and locate the corresponding code example in the WebGPU folder 😉.</p>

            <p className="text-gray-600">
                This code segment demonstrates the implementation of a camera in 3D space.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">Understanding camera and  'lookAt' Function</h2>
            <p className="text-gray-600">
                The <code>lookAt</code> function is crucial for creating a realistic camera effect in 3D environments. It aligns the camera such that it 'looks at' a target point from a specific position, with a defined up direction. This setup helps in orienting the camera view matrix.
            </p>

            <ul className="list-disc list-inside text-gray-600 mt-4">
                <li><strong>eye( [cx, cy, cz] in the main function ):</strong> The camera's position in 3D space.</li>
                <li><strong>center:</strong> The point in 3D space where the camera is aimed. Shown as the object position here.</li>
                <li><strong>up( [ux, uy, uz] in the main function ):</strong> The vector defining which direction is 'up' from the camera's perspective, aiding in the camera's orientation.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">Camera Matrix Construction</h3>
            <p className='text-gray-600'>
                The camera matrix, a result of the <code>lookAt</code> function, is a transformation matrix that moves the entire scene to be correctly oriented relative to the camera's viewpoint. It combines rotation (to face the target) and translation (to position the camera).
            </p>

            <ul className='text-gray-600 text-sm'>
                <p>
                    <strong>Forward Vector:</strong> Computed as the difference between the <InlineMath>{'eye'}</InlineMath> and <InlineMath>{'center'}</InlineMath> positions, pointing in the reverse direction of where the camera faces.
                    <BlockMath>{"\\vec{F} = \\text{eye} - \\text{center}"}</BlockMath>
                </p>
                <p>
                    Normalize <InlineMath>{'\\vec{F}'}</InlineMath> to get <InlineMath>{'\\vec{f}'}</InlineMath>:
                    <BlockMath>{"\\vec{f} = \\frac{\\vec{F}}{||\\vec{F}||}"}</BlockMath>
                </p>
                <p>
                    <strong>Up Vector:</strong> The up vector is normalized to maintain direction without scaling effects.
                    <BlockMath>{"\\vec{u_p} = \\frac{\\text{UP}}{||\\text{UP}||}"}</BlockMath>
                </p>
                <p>
                    <strong>Side Vector:</strong> The side vector <InlineMath>{'\\vec{s}'}</InlineMath> is the cross product of <InlineMath>{'\\vec{u_p}'}</InlineMath> and <InlineMath>{'\\vec{f}'}</InlineMath>, representing the camera's side direction.
                    <BlockMath>{"\\vec{s} = \\vec{u_p} \\times \\vec{f}"}</BlockMath>
                </p>
                <p>
                    <strong>Corrected Up Vector:</strong> Recomputed as the cross product of <InlineMath>{'\\vec{f}'}</InlineMath> and <InlineMath>{'\\vec{s}'}</InlineMath>.
                    <BlockMath>{"\\vec{u} = \\vec{f} \\times \\vec{s}"}</BlockMath>
                </p>

                <h2>Matrix Construction</h2>
                <p>
                    The view matrix is formed using the basis vectors <InlineMath>{'\\vec{s}'}</InlineMath>, <InlineMath>{'\\vec{u}'}</InlineMath>, and <InlineMath>{'\\vec{f}'}</InlineMath> as the rows or columns (depending on row-major or column-major order):
                </p>
                <BlockMath>
                    {`\\begin{bmatrix}
s_x & u_x & -f_x & 0 \\\\
s_y & u_y & -f_y & 0 \\\\
s_z & u_z & -f_z & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}`}
                </BlockMath>
            </ul>

            <p className="text-gray-600 mt-2">
                The view matrix transforms coordinates from the world space into the camera (or view) space. This is achieved using a lookAt function as discussed, which aligns the camera in a particular direction with a specified "up" direction relative to a target or "center" point. The view matrix essentially positions and orients everything in the world relative to the camera’s point of view. This makes the camera the new reference point, instead of the origin of the world space.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">Matrix Combination</h2>
            <h2 className="font-semibold text-gray-900">Model Matrix (M)
                <Link className="text-blue-500 text-sm ml-2 hover:text-blue-700 underline" to="/03Transformation3D">Check out Transformation3D</Link>
            </h2>
            <BlockMath math={'\\textbf{M} = \\text{Scale} \\times \\text{Rotate} \\times \\text{Translate}'} />
            <h2 className="font-semibold text-gray-900">View Matrix (V)</h2>
            <BlockMath math={'\\textbf{V} = \\text{lookAt}(\\text{cameraPosition}, \\text{targetPosition}, \\text{upVector})'} />
            <h2 className="font-semibold text-gray-900">Projection Matrix (P)
                <Link className="text-blue-500 text-sm ml-2 hover:text-blue-700 underline" to="/04Perspective">Check out Perspective</Link>
            </h2>

            <h2 className="font-semibold text-gray-900">Model-View-Projection Matrix Formula</h2>
            <p className="text-gray-600">The combined matrix, often referred to as the Model-View-Projection Matrix (MVP), is calculated as:</p>
            <BlockMath math={'\\textbf{MVP} = \\textbf{P} \\times \\textbf{V} \\times \\textbf{M}'} />

        </div>
    </section>

}