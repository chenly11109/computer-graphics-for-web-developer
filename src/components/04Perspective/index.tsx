import { Link } from "react-router-dom"

export default function Transformation2D(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/04perspective">Demo</Link>

        <h1 className="text-2xl">frustum perspective</h1>

        <br className="mt-5"/>
        <h1 className="text-2xl">Camera</h1>
        <h2>up</h2>
        <h2>lookAt</h2>
    </section>
}