import { Link } from "react-router-dom"

export default function Transformation2D(){
    return <section>
        <h1 className="text-3xl">Transformation</h1>
        <Link className="font-bold underline text-xl block mt-2" to="/webgpu/02transformation2D">Demo</Link>
        <div className="mt-5">
        <h2 className="text-2xl">vector, matrix(3x3) & algebra</h2>
        

        <div className="mt-5">
        <h2 className="text-2xl">transformation</h2>
        <h3 className="text-xl">scale</h3>
        <h3 className="text-xl">rotation</h3>
        <h3 className="text-xl">translation</h3>

        <div className="mt-5">
        <h2 className="text-2xl">webgpu</h2>
        <h2 className="text-2xl">bindGroup</h2>
        <h2 className="text-2xl">cull</h2>
        <h2 className="text-2xl">storage buffer and memory layout size</h2>
        <a className="underline" href="https://toji.dev/webgpu-best-practices/bind-groups.html">related material</a>

        </div>

        <div className="mt-5">
        <h2 className="text-2xl">ui - leva</h2>
        </div>
        </div>
        </div>
        
      
    </section>
}