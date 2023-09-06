import { Outlet, NavLink } from "react-router-dom";

export default function Notes(){
    return <main className="flex flex-row gap-20 m-5">

<section>
    <NavLink className={({isActive})=>isActive?"underline block":"block"} to="01basics">Basics</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block":"block"} to="02transformation2D">Transformation2D</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block":"block"} to="03transformation3D">Transformation3D</NavLink>
</section>
        <Outlet />
    </main>
}