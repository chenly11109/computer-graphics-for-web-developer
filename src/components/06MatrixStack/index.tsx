import { Link } from "react-router-dom"

export default function Basics() {
    return <section className="max-w-4xl pb-4 mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-6">
        <h1 className="text-3xl font-semibold text-gray-900 my-4">Matrix Stacks</h1>
        <Link className="text-blue-500 hover:text-blue-700 font-semibold underline" to="/webgpu/06MatrixStack">Demo</Link>
        <p className="text-gray-600 mt-2">
            A matrix stack is akin to a stack of books. Each book represents a transformation matrix. When a new matrix (book) is added (pushed) onto the stack, it becomes the new context for further transformations. Removing (popping) a matrix reverts to the previous context, making this structure ideal for handling complex and nested transformations in 3D environments.
        </p>
        <a className="text-blue-500 hover:text-blue-700 underline" href="https://www.geeksforgeeks.org/implementation-stack-javascript/">Implementation of Stacks in Javascript</a>

        <h2 className="text-2xl font-semibold text-gray-900 my-4">Matrix Stacks in Computer Graphics</h2>
        <p className="text-gray-600 mt-2">
            In computer graphics, a matrix stack is used to manage different transformation states. This structure allows for easy manipulation of the scene or objects within it through transformations like translation (moving), scaling (resizing), and rotation. Matrix stacks are particularly useful in handling complex scenes where objects are hierarchically related and transformations need to be applied in a nested manner.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">Key Components of the MatrixStack Class</h2>
        <p className="text-gray-600 mt-2">
            <strong>1. Current Matrix (m_currMatrix):</strong> This is the active transformation matrix that represents the current state of transformations. It is used to apply new transformations and is the top matrix of the stack.
        </p>
        <p className="text-gray-600 mt-2">
            <strong>2. Matrix Stack (stack):</strong> This is an array of matrices that stores the history of transformation states. Each element in the stack represents a snapshot of the transformations up to that point.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">Methods of the MatrixStack Class</h2>
        <p className="text-gray-600 mt-2">
            <strong>Constructor (constructor):</strong> Initializes the matrix stack and sets the current matrix to an identity matrix (no transformation) or a provided matrix. The identity matrix is a key element because it serves as a neutral element in matrix operations, meaning any transformation applied to it results in the transformation itself.
        </p>
        <p className="text-gray-600 mt-2">
            <strong>Push (push):</strong> This method saves the current matrix by pushing it onto the stack. Then, it optionally applies a new transformation matrix to the current matrix. This is crucial for scenarios where you need to temporarily switch to a new transformation context, perform operations, and then revert back.
        </p>
        <p className="text-gray-600 mt-2">
            <strong>Pop (pop):</strong> This method reverses the most recent transformation by popping the top matrix from the stack and making it the current matrix again. This is used to backtrack in the transformation history, typically when an operation affecting a particular transformation scope is completed.
        </p>
        <p className="text-gray-600 mt-2">
            <strong>Apply Matrix (applyMatrix):</strong> A helper method that applies a transformation matrix to the current matrix using matrix multiplication. This method is used internally to modify the current matrix based on the transformation logic defined in other methods like rotateX, rotateY, perspective, and lookAt.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">Practical Application</h2>
        <p className="text-gray-600 mt-2">
            In practice, this implementation allows for constructing complex scenes where each object or group of objects can have transformations applied independently yet maintain a clear and manageable hierarchy. For example, you might use this matrix stack when rendering a scene where a character (parent object) can move through a world space, and its arms (child objects) need to rotate independently but relative to the character's position.
        </p>
        <p className="text-gray-600 mt-2">
            Using methods like push and pop, you can add a new set of transformations while preserving the ability to revert back to the previous state, providing great flexibility and control over how objects are manipulated and displayed in a 3D environment. This makes the MatrixStack a powerful tool in the toolbox of graphics programming, particularly when working with complex animations and scene hierarchies.
        </p>

        <a className="text-blue-500 hover:text-blue-700 underline block" href="https://katie.cs.mtech.edu/classes/csci441/Slides/11-MatrixStacks.pdf">Reading Material</a>
        <a className="text-blue-500 hover:text-blue-700 underline block" href="http://edeleastar.github.io/opengl-programming/topic05/pdf/3.MatrixStacks.pdf">Reading Material</a>

        <h1 className="text-3xl font-semibold text-gray-900 my-4">Other Key Concepts</h1>
        <h2 className="text-xl text-gray-900 font-semibold">Parsing the OBJ File</h2>
        <p className="text-gray-600 mt-2">Check out <strong>createTeapot</strong> function!</p>
        <p className="text-gray-600 mt-2">
            The OBJ file format is a simple data-format that represents 3D geometry alone — namely, the position of each vertex, the UV position of each texture coordinate vertex, the vertex normals, and the faces that make each polygon defined as a list of vertices, and texture vertices. An OBJ file typically starts with a list of vertex positions (v), texture coordinates (vt), vertex normals (vn), and faces (f). Faces are defined using indices that refer to these lists.</p>
    </section>

}
