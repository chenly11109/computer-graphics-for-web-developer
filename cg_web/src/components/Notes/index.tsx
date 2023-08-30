import { Outlet, NavLink } from "react-router-dom";

export default function Notes(){
    return <main className="flex flex-row gap-10">

<section>
    <NavLink className={({isActive})=>isActive?"underline block":"block"} to="01basics">Basics</NavLink>
    <NavLink className={({isActive})=>isActive?"underline block":"block"} to="02transformation2D">Transformation2D</NavLink>
</section>
        <Outlet />
    </main>
}