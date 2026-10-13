import { createBrowserRouter } from "react-router-dom";

import Carrito from "./pages/Carrito/Carrito"
import Catalogo from "./pages/Catalogo/Catalogo"
import Inicio from "./pages/Inicio/Inicio"
import Login from "./pages/Login/Login"
import Registro from "./pages/Registro/Registro"

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<Inicio/>
    },
    {
        path:'/Carrito',
        element:<Carrito/>
    },
    {
        path:'/Catalogo',
        element:<Catalogo/>
    },
    {
        path:'/Login',
        element:<Login/>
    },
    {
        path:'/Registro',
        element:<Registro/>
    }
])