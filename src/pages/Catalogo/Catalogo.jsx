import { useState } from "react";
import { Modal, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./catalogo.module.css";

const productos = [
  {
    codigo: "TC001",
    categoria: "Tortas Cuadradas",
    tipo: "cuadrada",
    nombre: "Torta Cuadrada de Chocolate",
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
    precio: 45000,
    icono: "cake"
  },
  {
    codigo: "TC002",
    categoria: "Tortas Cuadradas",
    tipo: "cuadrada",
    nombre: "Torta Cuadrada de Frutas",
    descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
    precio: 50000,
    icono: "cake"
  },
  {
    codigo: "TT001",
    categoria: "Tortas Circulares",
    tipo: "circular",
    nombre: "Torta Circular de Vainilla",
    descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
    precio: 40000,
    icono: "cake"
  },
  {
    codigo: "TT002",
    categoria: "Tortas Circulares",
    tipo: "circular",
    nombre: "Torta Circular de Manjar",
    descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
    precio: 42000,
    icono: "cake"
  },
  {
    codigo: "PI001",
    categoria: "Postres Individuales",
    tipo: "individual",
    nombre: "Mousse de Chocolate",
    descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
    precio: 5000,
    icono: "icecream"
  },
  {
    codigo: "PI002",
    categoria: "Postres Individuales",
    tipo: "individual",
    nombre: "Tiramisú Clásico",
    descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
    precio: 5500,
    icono: "icecream"
  },
  {
    codigo: "PSA001",
    categoria: "Productos Sin Azúcar",
    tipo: null,
    nombre: "Torta Sin Azúcar de Naranja",
    descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
    precio: 48000,
    icono: "eco"
  },
  {
    codigo: "PSA002",
    categoria: "Productos Sin Azúcar",
    tipo: null,
    nombre: "Cheesecake Sin Azúcar",
    descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
    precio: 47000,
    icono: "eco"
  },
  {
    codigo: "PT001",
    categoria: "Pastelería Tradicional",
    tipo: null,
    nombre: "Empanada de Manzana",
    descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
    precio: 3000,
    icono: "bakery_dining"
  },
  {
    codigo: "PT002",
    categoria: "Pastelería Tradicional",
    tipo: null,
    nombre: "Tarta de Santiago",
    descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos.",
    precio: 6000,
    icono: "bakery_dining"
  },
  {
    codigo: "PG001",
    categoria: "Productos Sin Gluten",
    tipo: null,
    nombre: "Brownie Sin Gluten",
    descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
    precio: 4000,
    icono: "grain"
  },
  {
    codigo: "PG002",
    categoria: "Productos Sin Gluten",
    tipo: null,
    nombre: "Pan Sin Gluten",
    descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
    precio: 3500,
    icono: "grain"
  },
  {
    codigo: "PV001",
    categoria: "Productos Vegana",
    tipo: null,
    nombre: "Torta Vegana de Chocolate",
    descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
    precio: 50000,
    icono: "spa"
  },
  {
    codigo: "PV002",
    categoria: "Productos Vegana",
    tipo: null,
    nombre: "Galletas Veganas de Avena",
    descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
    precio: 4500,
    icono: "spa"
  },
  {
    codigo: "TE001",
    categoria: "Tortas Especiales",
    tipo: null,
    nombre: "Torta Especial de Cumpleaños",
    descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
    precio: 55000,
    icono: "celebration"
  },
  {
    codigo: "TE002",
    categoria: "Tortas Especiales",
    tipo: null,
    nombre: "Torta Especial de Boda",
    descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
    precio: 60000,
    icono: "celebration"
  }
];


const categorias = [
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Vegana",
  "Tortas Especiales"
];


function formatearPrecio(numero){
    return numero.toLocaleString("es-CL");
}

function Catalogo(){
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem("carrito")) || []);


    const [categoriaElegida, setCategoriaElegida] = useState("");
    const [tipoElegido, setTipoElegido] = useState("");
    const [orden, setOrden] = useState("relevancia");


    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
    const [tamano, setTamano] = useState("mediana");
    const [mensaje, setMensaje] = useState("");


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
