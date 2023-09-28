import { Outlet, NavLink } from "react-router-dom";

export default function Notes(){
    return <main className="flex flex-row gap-20 m-5">

<section className="w-1/6">
    <h1 className="font-bold">Transformation Matrix</h1>
    <div className="ml-5">
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="01basics">Basics</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="02transformation2D">Transformation2D</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="03transformation3D">Transformation3D</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="04perspective">Perspective</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="05camera">Camera</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="06matrix">Matrix Stack</NavLink>
    </div>
    <h1 className="font-bold">Light</h1>
    <div className="ml-5">
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="07basics">Basics</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="08gouraudShading">Gouraud Shading</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block font-bold":"block hover:underline"} to="09phongShading">Phong Shading</NavLink>
    </div>
</section>
        <Outlet />
    </main>
}