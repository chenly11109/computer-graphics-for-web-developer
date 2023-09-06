import { Link } from "react-router-dom"

export default function Transformation2D(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/03transformation3D">Demo</Link>

        <h1 className="text-2xl">Transformation</h1>
        <h2>Rotation</h2>

        <br className="mt-5"/>
        <h1 className="text-2xl">Clipping Plan</h1>
        <h2>Ortho</h2>

        <br className="mt-5"/>
        <h1 className="text-2xl">WebGPU</h1>
        <h2>depth</h2>
        <h2>alpha and blend mode</h2>
    </section>
}