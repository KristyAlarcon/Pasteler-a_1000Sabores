import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Formulario from "../../components/Formulario/formulario";
import styles from "./carrito.module.css";

const COSTO_ENVIO = 3000;

const camposCheckout = [
    { id: "direccion", label: "Dirección de despacho" },
    { id: "fecha", label: "Fecha de entrega preferida", col: "col-12 col-md-6", type: "date" },
    {
        id: "pago", label: "Método de pago", col: "col-12 col-md-6", type: "select",
        opciones: [
            { valor: "debito", texto: "Tarjeta de débito" },
            { valor: "credito", texto: "Tarjeta de crédito" },
            { valor: "transferencia", texto: "Transferencia bancaria" }
        ]
    }
];

function formatearPrecio(numero){
    return numero.toLocaleString("es-CL");
}

function Carrito(){
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem("carrito")) || []);


    const checkoutRef = useRef(null);
    const [mostrarCheckout, setMostrarCheckout] = useState(false);

    const [boleta, setBoleta] = useState(null);

    useEffect(() => {
        if (mostrarCheckout) {
            checkoutRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [mostrarCheckout]);

    function actualizarCarrito(nuevoCarrito){
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);
    }

    function cambiarCantidad(indice, cambio){
        const nuevoCarrito = carrito.map((item) => ({ ...item }));
        nuevoCarrito[indice].cantidad += cambio;

        if (nuevoCarrito[indice].cantidad < 1) {
            nuevoCarrito[indice].cantidad = 1;
        }

        actualizarCarrito(nuevoCarrito);
    }

    function eliminarItem(evento, indice){
        evento.preventDefault();
        actualizarCarrito(carrito.filter((item, i) => i !== indice));
    }

    let subtotal = 0;
    carrito.forEach(function (item) {
        subtotal += item.precio * item.cantidad;
    });
    const porcentajeDescuento = sesion ? (sesion.descuentoFinal || 0) : 0;
    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = subtotal - montoDescuento + COSTO_ENVIO;

    function irACheckout(evento){
        evento.preventDefault();
        if (mostrarCheckout) {
            checkoutRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setMostrarCheckout(true);
    }

    function validar(valores, alerta){
        if (valores.direccion.trim().length == 0) {
            alerta("La dirección no debe de estar vacía.");
            return false;
        }
        if (valores.direccion.trim().length > 300) {
            alerta("La dirección debe tener máximo 300 caracteres.");
            return false;
        }
        if (valores.fecha.length == 0) {
            alerta("Debes elegir una fecha de entrega.");
            return false;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (new Date(valores.fecha) < hoy) {
            alerta("La fecha no puede ser anterior a hoy.");
            return false;
        }
        return true;
    }

    function generarBoleta(valores, alerta){
        if (validar(valores, alerta) == false) {
            return;
        }

        setBoleta({

            numeroPedido: Math.floor(Math.random() * 900000) + 100000,
            fecha: new Date().toLocaleDateString("es-CL"),
            fechaEntrega: new Date(valores.fecha).toLocaleDateString("es-CL"),
            direccion: valores.direccion,
            items: carrito,
            subtotal: subtotal,
            porcentajeDescuento: porcentajeDescuento,
            montoDescuento: montoDescuento,
            total: total
        });

        actualizarCarrito([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return(
        <>
            <Navbar/>


            {!boleta && (
                <section id="vista-carrito">
                    <div className="container">
                        <h1 className={styles.titulo}>Tu carrito</h1>

                        {carrito.length === 0 && (
                            <div id="carrito-vacio" className="empty-state">
                                <i className="material-icons">shopping_cart</i>
                                <p>Tu carrito está vacío por ahora.</p>
                                <Link to="/Catalogo" className="btn btn-primary">Ir al catálogo</Link>
                            </div>
                        )}

                        {carrito.length > 0 && (
                            <div className={"row " + styles.conItems} id="carrito-con-items">
                                <div className="col-12 col-md-7">
                                    <div id="lista-items">
                                        {carrito.map((item, indice) => (
                                            <div className={styles.filaCarrito} key={indice}>
                                                <div className={styles.iconoMini}><i className="material-icons">cake</i></div>
                                                <div className={styles.infoItem}>
                                                    <p className={styles.nombreItem}>{item.nombre}</p>
                                                    {item.tamano && <p className={"texto-secundario " + styles.detalleItem}>Tamaño: {item.tamano}</p>}
                                                    {item.mensaje && <p className={"texto-secundario " + styles.detalleItem}>Mensaje: "{item.mensaje}"</p>}
                                                    <p className={"texto-secundario " + styles.detalleItem}>${formatearPrecio(item.precio)} c/u</p>
                                                </div>
                                                <div className="cantidad-control">
                                                    <button type="button" className="btn-restar" onClick={() => cambiarCantidad(indice, -1)}>−</button>
                                                    <span>{item.cantidad}</span>
                                                    <button type="button" className="btn-sumar" onClick={() => cambiarCantidad(indice, 1)}>+</button>
                                                </div>
                                                <p className={styles.subtotalItem}>${formatearPrecio(item.precio * item.cantidad)}</p>
                                                <a href="#" className="btn-eliminar" title="Eliminar" onClick={(e) => eliminarItem(e, indice)}><i className="material-icons">delete</i></a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-12 col-md-5">
                                    <div className={styles.resumenCarrito}>
                                        <h5 className={styles.sinMargenArriba}>Resumen del pedido</h5>
                                        <div className={styles.resumenLinea}><span>Subtotal</span><span id="resumen-subtotal">${formatearPrecio(subtotal)}</span></div>
                                        {porcentajeDescuento > 0 && (
                                            <div className={styles.resumenLinea + " " + styles.descuento} id="fila-descuento">
                                                <span id="texto-descuento">Descuento ({porcentajeDescuento}%)</span><span id="resumen-descuento">-${formatearPrecio(montoDescuento)}</span>
                                            </div>
                                        )}
                                        <div className={styles.resumenLinea}><span>Envío</span><span id="resumen-envio">${formatearPrecio(COSTO_ENVIO)}</span></div>
                                        <div className={styles.resumenLinea + " " + styles.total}><span>Total</span><span id="resumen-total">${formatearPrecio(total)}</span></div>

                                        {!sesion && (
                                            <div id="aviso-sin-sesion" className={"aviso-descuento bg-10 activo " + styles.avisoSesion}>
                                                <i className="material-icons">info</i>
                                                <span><Link to="/Login">Inicia sesión</Link> para aplicar tus descuentos automáticamente.</span>
                                            </div>
                                        )}

                                        <a href="#" id="btn-ir-checkout" className={"btn btn-lg btn-primary " + styles.botonCheckout} onClick={irACheckout}>
                                            Continuar con el pedido
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}


                        {mostrarCheckout && carrito.length > 0 && (
                            <div id="bloque-checkout" ref={checkoutRef} className={styles.bloqueCheckout}>
                                <div className="row">
                                    <div className="col-12 col-md-7">
                                        <Formulario
                                            className="card card-body"
                                            titulo="Datos de entrega"
                                            campos={camposCheckout}
                                            textoBoton="Confirmar pedido"
                                            onGuardar={generarBoleta}
                                        />
                                    </div>
                                    <div className="col-12 col-md-5">
                                        <div className="card card-body suave">
                                            <h6 className={styles.subtitulo}>Antes de confirmar</h6>
                                            <p className="texto-secundario">Recibirás una boleta y podrás seguir el estado de tu pedido desde la
                                                preparación hasta la entrega.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}


            {boleta && (
                <section id="vista-confirmacion">
                    <div className="container">
                        <div className={"text-center " + styles.encabezadoConfirmacion}>
                            <i className={"material-icons " + styles.iconoConfirmado}>check_circle</i>
                            <h1 className={styles.tituloConfirmacion}>¡Pedido confirmado!</h1>
                            <p className="texto-secundario">Guarda tu número de pedido para hacer seguimiento.</p>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-7">
                                <div className="card card-body">
                                    <h5 className={styles.sinMargenArriba}>Boleta #<span id="boleta-id">{boleta.numeroPedido}</span></h5>
                                    <p className="texto-secundario" id="boleta-fecha">Emitida el {boleta.fecha}</p>
                                    <div id="boleta-items">
                                        {boleta.items.map((item, indice) => (
                                            <div className={styles.resumenLinea} key={indice}>
                                                <span>{item.cantidad}x {item.nombre}</span>
                                                <span>${formatearPrecio(item.precio * item.cantidad)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.dividerSuave}></div>
                                    <div className={styles.resumenLinea}><span>Subtotal</span><span id="boleta-subtotal">${formatearPrecio(boleta.subtotal)}</span></div>
                                    {boleta.porcentajeDescuento > 0 && (
                                        <div className={styles.resumenLinea + " " + styles.descuento} id="boleta-fila-descuento">
                                            <span>Descuento</span><span id="boleta-descuento">-${formatearPrecio(boleta.montoDescuento)}</span>
                                        </div>
                                    )}
                                    <div className={styles.resumenLinea}><span>Envío</span><span id="boleta-envio">${formatearPrecio(COSTO_ENVIO)}</span></div>
                                    <div className={styles.resumenLinea + " " + styles.total}><span>Total pagado</span><span id="boleta-total">${formatearPrecio(boleta.total)}</span></div>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="card card-body suave">
                                    <h6 className={styles.subtitulo}>Seguimiento del pedido</h6>
                                    <div className={styles.pasosSeguimiento}>
                                        <div className={styles.pasoSeguimiento + " " + styles.completo}><div className={styles.punto}><i className="material-icons tiny">check</i></div><span>Confirmado</span></div>
                                        <div className={styles.pasoSeguimiento + " " + styles.completo}><div className={styles.punto}><i className="material-icons tiny">check</i></div><span>Preparación</span></div>
                                        <div className={styles.pasoSeguimiento}><div className={styles.punto}>3</div><span>En camino</span></div>
                                        <div className={styles.pasoSeguimiento}><div className={styles.punto}>4</div><span>Entregado</span></div>
                                    </div>
                                    <p className={"texto-secundario " + styles.margenArriba}>
                                        Entrega estimada: <strong id="boleta-fecha-entrega">{boleta.fechaEntrega}</strong><br/>
                                        Dirección: <span id="boleta-direccion">{boleta.direccion}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={"text-center " + styles.margenArriba}>
                            <Link to="/Catalogo" className="btn btn-lg btn-primary">Seguir comprando</Link>
                        </div>
                    </div>
                </section>
            )}

            <Footer/>
        </>
    );


}

export default Carrito;
