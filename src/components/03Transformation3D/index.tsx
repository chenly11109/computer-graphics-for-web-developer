import { Link } from "react-router-dom"

export default function Transformation3D(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/03transformation3D">Demo</Link>

        <h1 className="text-2xl">Transformation</h1>
        <h2>Rotation</h2>

        <br className="mt-5"/>
        <h1 className="text-2xl">Clipping Plan</h1>
        WebGPU uses a left-handed,  the Z-axis is typically defined to be pointing out of the screen towards the viewer, which is a common convention in 3D graphics APIs and frameworks.
        <h2>Ortho</h2>

        <br className="mt-5"/>
        <h1 className="text-2xl">WebGPU</h1>
        <h2>depth</h2>
        <h2>alpha and blend mode</h2>
    </section>
}