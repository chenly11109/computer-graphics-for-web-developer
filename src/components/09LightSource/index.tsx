import { Link } from "react-router-dom"

export default function LightSource(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/09LightSource">Demo</Link>
        <h1 className="text-2xl">Light Source</h1>
        <h2 className="text-2xl">point light</h2>
        <h2 className="text-2xl">directional light</h2>
        <h2 className="text-2xl">ambient light</h2>

       
    </section>
}