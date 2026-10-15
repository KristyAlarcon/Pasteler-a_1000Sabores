import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar as BarraNavegacion, Nav, Container, Badge } from "react-bootstrap";
import styles from "./navbar.module.css";

function Navbar(){
    const navigate = useNavigate();
    const [sesion, setSesion] = useState(JSON.parse(localStorage.getItem("sesion")));

    // Total de productos guardados en el carrito
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let cantidadCarrito = 0;
    carrito.forEach(function (item) {
        cantidadCarrito += item.cantidad;
    });

    function cerrarSesion(evento){
        evento.preventDefault();
        localStorage.removeItem("sesion");
        setSesion(null);
        navigate('/');
    }

    return(
        <BarraNavegacion expand="lg" className={styles.barra}>
            <Container>
                <BarraNavegacion.Brand as={Link} to="/" className={styles.marca}>
                    <img src="/img/logo.png" alt="" className={styles.logo} />
                    Mil Sabores
                </BarraNavegacion.Brand>

                <BarraNavegacion.Toggle aria-controls="menu-principal" />

                <BarraNavegacion.Collapse id="menu-principal">
                    <Nav className="ms-auto align-items-lg-center">
                        <Nav.Link as={NavLink} to="/" end className={styles.enlace}>Inicio</Nav.Link>
                        <Nav.Link as={NavLink} to="/Catalogo" className={styles.enlace}>Catálogo</Nav.Link>
                        <Nav.Link href="#" className={styles.enlace}>Comunidad</Nav.Link>
                        <Nav.Link as={NavLink} to="/Admin" className={styles.enlace}>Administrar</Nav.Link>
                        <Nav.Link as={NavLink} to="/Carrito" className={styles.enlace}>
                            <i className={"material-icons " + styles.iconoCarrito}>shopping_cart</i>
                            Carrito <Badge pill className={styles.badge} id="carrito-badge">{cantidadCarrito}</Badge>
                        </Nav.Link>
                    </Nav>

                    <Nav id="nav-usuario" className="ms-lg-3">
                        {sesion ? (
                            <>
                                <BarraNavegacion.Text className={styles.saludo}>Hola, {sesion.nombre}</BarraNavegacion.Text>
                                <Nav.Link href="#" onClick={cerrarSesion} className={styles.enlace}>Cerrar sesión</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/Login" className={styles.enlace}>Iniciar sesión</Nav.Link>
                                <Nav.Link as={Link} to="/Registro" className={styles.enlace}>Regístrate</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BarraNavegacion.Collapse>
            </Container>
        </BarraNavegacion>
    );
}

export default Navbar;
