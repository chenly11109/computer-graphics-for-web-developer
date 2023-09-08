import { Link } from "react-router-dom"

export default function Camera(){
    return <section>
        <Link className="font-bold underline" to="/webgpu/04perspective">Demo</Link>

        <h1 className="text-2xl">frustum</h1>
        <h1 className="text-2xl">perspective</h1>
  
    </section>
}