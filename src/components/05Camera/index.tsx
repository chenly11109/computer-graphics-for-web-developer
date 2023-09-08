import { Link } from "react-router-dom"

export default function Camera(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/05Camera">Demo</Link>
        <h1 className="text-2xl">Camera</h1>
        <h2 className="text-2xl">lookat</h2>
        <h2 className="text-2xl">cross product</h2>
        <h2 className="text-2xl">transform coordinate system</h2>
       
    </section>
}