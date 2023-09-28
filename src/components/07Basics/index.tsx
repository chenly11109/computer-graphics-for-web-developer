import { Link } from "react-router-dom"

export default function MatrixStack(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/07basics ">Demo</Link>
        <h1 className="text-2xl">light origin</h1>
        <h2 className="text-xl">ambient light</h2>
        <h2 className="text-xl">point light</h2>
        <h2 className="text-xl">directional light</h2>


        <h2 className="text-2xl">Load Model(obj)</h2>
        <h2 className="text-2xl">Load Texture</h2>

       
    </section>
}