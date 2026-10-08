import { createBrowserRouter } from "react-router-dom";
import App from "./App"

import Carrito from "./pages/Carrito/Carrito"
import Catalogo from "./pages/Catalogo/Catalogo"
import Login from "./pages/Login/Login"
import Registro from "./pages/Registro/Registro"

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<App/>
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