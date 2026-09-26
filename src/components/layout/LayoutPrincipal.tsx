import { Outlet } from "react-router-dom";
import NavbarPrincipal from "./NavbarPrincipal";

const LayoutPrincipal = () => {
    return (
        <>
            <NavbarPrincipal />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default LayoutPrincipal;