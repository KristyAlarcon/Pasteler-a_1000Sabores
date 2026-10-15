import { useState } from "react";
import { Modal, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./catalogo.module.css";
import { obtenerProductos, categorias } from "../../data/productos";


function formatearPrecio(numero){
    return numero.toLocaleString("es-CL");
}

function Catalogo(){
    // Productos desde el archivo de datos (incluye los cambios del administrador)
    const [productos] = useState(obtenerProductos);
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem("carrito")) || []);

    // Filtros
    const [categoriaElegida, setCategoriaElegida] = useState("");
    const [tipoElegido, setTipoElegido] = useState("");
    const [orden, setOrden] = useState("relevancia");

    // Modal del producto
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
    const [tamano, setTamano] = useState("mediana");
    const [mensaje, setMensaje] = useState("");

    // Aviso de "se agregó al carrito"
    const [mensajeAviso, setMensajeAviso] = useState("");

    function obtenerProductosFiltrados(){
        let resultado = productos.filter(function (producto) {
            const coincideCategoria =
                categoriaElegida.length === 0 || producto.categoria === categoriaElegida;
            const coincideTipo = tipoElegido.length === 0 || producto.tipo === tipoElegido;

            return coincideCategoria && coincideTipo;
        });

        if (orden === "menor-precio") {
            resultado.sort(function (a, b) {
                return a.precio - b.precio;
            });
        } else if (orden === "mayor-precio") {
            resultado.sort(function (a, b) {
                return b.precio - a.precio;
            });
        }

        return resultado;
    }

    const listaProductos = obtenerProductosFiltrados();

    function abrirModalProducto(producto){
        setProductoSeleccionado(producto);
        setCantidadSeleccionada(1);
        setMensaje("");
        setMostrarModal(true);
    }

    function restarCantidad(){
        if (cantidadSeleccionada > 1) {
            setCantidadSeleccionada(cantidadSeleccionada - 1);
        }
    }

    function sumarCantidad(){
        setCantidadSeleccionada(cantidadSeleccionada + 1);
    }

    function agregarProductoAlCarrito(){
        if (!productoSeleccionado) return;

        const mensajeLimpio = mensaje.trim();
        const nuevoCarrito = carrito.map((item) => ({ ...item }));

        const itemExistente = nuevoCarrito.find(function (item) {
            return (
                item.codigo === productoSeleccionado.codigo &&
                item.tamano === tamano &&
                item.mensaje === mensajeLimpio
            );
        });

        if (itemExistente) {
            itemExistente.cantidad += cantidadSeleccionada;
        } else {
            nuevoCarrito.push({
                codigo: productoSeleccionado.codigo,
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                tamano: tamano,
                mensaje: mensajeLimpio,
                cantidad: cantidadSeleccionada
            });
        }

        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);

        setMostrarModal(false);
        setMensajeAviso(productoSeleccionado.nombre + " se agregó al carrito.");
    }

    const puedePersonalizarTamano = productoSeleccionado ? productoSeleccionado.tipo !== null : true;

    return(
        <>
            <Navbar/>

            <section className={styles.seccion}>
                <div className="container">
                    <h1 className={styles.titulo}>Catálogo de productos</h1>
                    <p className="texto-secundario">Filtra por categoría, forma o tamaño.</p>

                    <div className={styles.filtrosPanel}>
                        <div className="row">
                            <Form.Group className="col-12 col-md-4 mb-3" controlId="filtro-categoria">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Select value={categoriaElegida} onChange={(e) => setCategoriaElegida(e.target.value)}>
                                    <option value="">Todas las categorías</option>
                                    {categorias.map((nombreCategoria) => (
                                        <option key={nombreCategoria} value={nombreCategoria}>{nombreCategoria}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-12 col-md-4 mb-3" controlId="filtro-tipo">
                                <Form.Label>Tipo de torta</Form.Label>
                                <Form.Select value={tipoElegido} onChange={(e) => setTipoElegido(e.target.value)}>
                                    <option value="">Cualquier forma</option>
                                    <option value="cuadrada">Cuadrada</option>
                                    <option value="circular">Circular</option>
                                    <option value="individual">Individual</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-12 col-md-4 mb-3" controlId="filtro-orden">
                                <Form.Label>Ordenar por</Form.Label>
                                <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
                                    <option value="relevancia">Relevancia</option>
                                    <option value="menor-precio">Menor precio</option>
                                    <option value="mayor-precio">Mayor precio</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    <p id="contador-resultados" className="texto-secundario">{listaProductos.length + " producto(s) encontrado(s)."}</p>

                    <div className="row g-4" id="grid-productos">
                        {listaProductos.map((producto) => (
                            <div className="col-12 col-sm-6 col-lg-3" key={producto.codigo}>
                                <div className={"card h-100 " + styles.productoCard} onClick={() => abrirModalProducto(producto)}>
                                    <div className={styles.productoMedia}><i className="material-icons">{producto.icono}</i></div>
                                    <div className="card-body d-flex flex-column">
                                        <span className={styles.chipCategoria}>{producto.categoria}</span>
                                        <p className={styles.productoNombre}>{producto.nombre}</p>
                                        <p className={styles.productoDesc}>{producto.descripcion}</p>
                                        <p className={styles.productoPrecio}>${formatearPrecio(producto.precio)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {listaProductos.length === 0 && (
                        <div className="empty-state" id="estado-vacio">
                            <i className="material-icons">search_off</i>
                            <p>No encontramos productos con esos filtros.</p>
                        </div>
                    )}
                </div>
            </section>


            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title as="h5" id="modal-nombre">{productoSeleccionado ? productoSeleccionado.nombre : "Producto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="texto-secundario" id="modal-descripcion">{productoSeleccionado ? productoSeleccionado.descripcion : ""}</p>
                    <p className={styles.productoPrecio} id="modal-precio">{productoSeleccionado ? "$" + formatearPrecio(productoSeleccionado.precio) : ""}</p>

                    {puedePersonalizarTamano && (
                        <Form.Group className="mb-3" controlId="modal-tamano">
                            <Form.Label>Tamaño</Form.Label>
                            <Form.Select value={tamano} onChange={(e) => setTamano(e.target.value)}>
                                <option value="pequeña">Pequeña (hasta 10 personas)</option>
                                <option value="mediana">Mediana (hasta 20 personas)</option>
                                <option value="grande">Grande (hasta 35 personas)</option>
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3" controlId="modal-mensaje">
                        <Form.Label>Mensaje especial para la torta (opcional)</Form.Label>
                        <Form.Control as="textarea" rows={2} maxLength={60}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)} />
                        <Form.Text className="texto-secundario">Máximo 60 caracteres.</Form.Text>
                    </Form.Group>

                    <div className={styles.bloqueCantidad}>
                        <label>Cantidad</label>
                        <div className="cantidad-control">
                            <button type="button" id="modal-menos" onClick={restarCantidad}>−</button>
                            <span id="modal-cantidad">{cantidadSeleccionada}</span>
                            <button type="button" id="modal-mas" onClick={sumarCantidad}>+</button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" className={styles.botonCancelar} onClick={() => setMostrarModal(false)}>Cancelar</Button>
                    <Button id="modal-agregar" onClick={agregarProductoAlCarrito}>Agregar al carrito</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-end" className="p-3" containerPosition="fixed">
                <Toast show={mensajeAviso !== ""} onClose={() => setMensajeAviso("")} delay={3000} autohide>
                    <Toast.Body>{mensajeAviso}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Footer/>
        </>
    );

}

export default Catalogo
