import { Link } from "react-router-dom";

export default function Basics(){
   return <section>
             <Link className="font-bold underline" to="/webgpu/01basics">Demo</Link>
        <h1>Basics</h1>

        <h2>Environment Setup</h2>

        <h2>render pipeline</h2>

        <h2>GPU related</h2>
        <h3>wgsl</h3>
        <h3>vertex shader</h3>
        <h3>fragment shader</h3>

        <h2>data - typed array</h2>
        <h3>how to map to GPU</h3>

        <h2>clip plan(-1, 1)</h2>
        <h3>mapping</h3>
        <h3>resize observer</h3>

        <h2>example</h2>
   


    </section>
}