import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Formulario from "../../components/Formulario/formulario";
import App_alert from "../../alert/alert";
import styles from "./admin.module.css";
import { obtenerProductos, agregarProducto, actualizarProducto, eliminarProducto, categorias } from "../../data/productos";

const opcionesCategoria = categorias.map((categoria) => ({ valor: categoria, texto: categoria }));

const opcionesTipo = [
    { valor: "", texto: "Sin forma (no se elige tamaño)" },
    { valor: "cuadrada", texto: "Cuadrada" },
    { valor: "circular", texto: "Circular" },
    { valor: "individual", texto: "Individual" }
];

const opcionesIcono = [
    { valor: "cake", texto: "Torta" },
    { valor: "icecream", texto: "Postre" },
    { valor: "bakery_dining", texto: "Pastelería" },
    { valor: "eco", texto: "Sin azúcar" },
    { valor: "grain", texto: "Sin gluten" },
    { valor: "spa", texto: "Vegano" },
    { valor: "celebration", texto: "Especial" }
];

// Campos del formulario de producto (el código solo se pide al crear)
const campoCodigo = { id: "codigo", label: "Código", col: "col-12 col-md-4", placeholder: "Ej: TC003" };
const camposProducto = [
    { id: "nombre", label: "Nombre", col: "col-12 col-md-8" },
    { id: "categoria", label: "Categoría", col: "col-12 col-md-6", type: "select", opciones: opcionesCategoria },
    { id: "tipo", label: "Forma", col: "col-12 col-md-6", type: "select", opciones: opcionesTipo },
    { id: "precio", label: "Precio", col: "col-12 col-md-6", type: "number" },
    { id: "icono", label: "Ícono", col: "col-12 col-md-6", type: "select", opciones: opcionesIcono },
    { id: "descripcion", label: "Descripción" }
];

// Al editar no se pide el código, así que el nombre ocupa todo el ancho
const camposEdicion = camposProducto.map((campo) =>
    campo.id === "nombre" ? { ...campo, col: "col-12" } : campo
);

function formatearPrecio(numero){
    return numero.toLocaleString("es-CL");
}

function Admin(){
    const [productos, setProductos] = useState(obtenerProductos);

    // Producto que se está editando (null = se está creando uno nuevo)
    const [productoEditando, setProductoEditando] = useState(null);
    // Cambiar esta clave vuelve a crear el formulario vacío
    const [claveFormulario, setClaveFormulario] = useState(0);

    // Mensaje de éxito de la página
    const [mensaje, setMensaje] = useState("");

    function validar(valores, alerta){
        if (!productoEditando) {
            if (valores.codigo.trim().length == 0) {
                alerta("El código no debe de estar vacío.");
                return false;
            }
            if (productos.some((p) => p.codigo === valores.codigo.trim().toUpperCase())) {
                alerta("Ya existe un producto con ese código.");
                return false;
            }
        }
        if (valores.nombre.trim().length == 0) {
            alerta("El nombre no debe de estar vacío.");
            return false;
        }
        if (Number(valores.precio) <= 0) {
            alerta("El precio debe ser mayor a 0.");
            return false;
        }
        if (valores.descripcion.trim().length == 0) {
            alerta("La descripción no debe de estar vacía.");
            return false;
        }
        return true;
    }

    function guardar(valores, alerta){
        if (validar(valores, alerta) == false) {
            return;
        }

        const datos = {
            nombre: valores.nombre.trim(),
            categoria: valores.categoria,
            tipo: valores.tipo === "" ? null : valores.tipo,
            precio: Number(valores.precio),
            icono: valores.icono,
            descripcion: valores.descripcion.trim()
        };

        if (productoEditando) {
            setProductos(actualizarProducto(productoEditando.codigo, datos));
            setMensaje("Se actualizó el producto " + datos.nombre + ".");
        } else {
            const codigo = valores.codigo.trim().toUpperCase();
            setProductos(agregarProducto({ codigo: codigo, ...datos }));
            setMensaje("Se agregó el producto " + datos.nombre + ".");
        }

        terminarEdicion();
    }

    function editar(producto){
        setProductoEditando(producto);
        setMensaje("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function terminarEdicion(){
        setProductoEditando(null);
        setClaveFormulario(claveFormulario + 1);
    }

    function eliminar(producto){
        if (!window.confirm("¿Eliminar el producto " + producto.nombre + "?")) {
            return;
        }
        setProductos(eliminarProducto(producto.codigo));
        setMensaje("Se eliminó el producto " + producto.nombre + ".");
        if (productoEditando && productoEditando.codigo === producto.codigo) {
            terminarEdicion();
        }
    }

    // Valores con los que se abre el formulario al editar
    const valoresIniciales = productoEditando
        ? { ...productoEditando, tipo: productoEditando.tipo || "", precio: String(productoEditando.precio) }
        : {};

    return(
        <>
            <Navbar/>

            <section>
                <div className="container">
                    <h1 className={styles.titulo}>Administrar catálogo</h1>
                    <p className="texto-secundario">Agrega, modifica o elimina los productos que se muestran en el catálogo.</p>

                    <App_alert
                        mostrarAlert={mensaje !== ""}
                        cerrarAlert={() => setMensaje("")}
                        variant="success"
                        msgAlert={mensaje}
                    />

                    <div className="row g-4">
                        <div className="col-12 col-lg-5">
                            <Formulario
                                key={productoEditando ? productoEditando.codigo : "nuevo-" + claveFormulario}
                                className={"card card-body " + styles.formulario}
                                titulo={productoEditando ? "Editar producto " + productoEditando.codigo : "Nuevo producto"}
                                campos={productoEditando ? camposEdicion : [campoCodigo, ...camposProducto]}
                                valoresIniciales={valoresIniciales}
                                textoBoton={productoEditando ? "Guardar cambios" : "Agregar producto"}
                                onGuardar={guardar}
                                pie={productoEditando && (
                                    <Button variant="link" className={styles.cancelar} onClick={terminarEdicion}>
                                        Cancelar edición
                                    </Button>
                                )}
                            />
                        </div>

                        <div className="col-12 col-lg-7">
                            <div className={"card " + styles.tablaCard}>
                                <Table responsive hover className="mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th className="d-none d-md-table-cell">Categoría</th>
                                            <th className="text-end">Precio</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((producto) => (
                                            <tr key={producto.codigo}>
                                                <td>{producto.codigo}</td>
                                                <td>{producto.nombre}</td>
                                                <td className="texto-secundario d-none d-md-table-cell">{producto.categoria}</td>
                                                <td className="text-end">${formatearPrecio(producto.precio)}</td>
                                                <td>
                                                    {/* En celular los botones quedan uno sobre otro */}
                                                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2">
                                                        <Button size="sm" variant="outline-primary" onClick={() => editar(producto)}>Editar</Button>
                                                        <Button size="sm" variant="outline-danger" onClick={() => eliminar(producto)}>Eliminar</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <p className="texto-secundario mt-2">{productos.length} producto(s) en el catálogo.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
}

export default Admin;
