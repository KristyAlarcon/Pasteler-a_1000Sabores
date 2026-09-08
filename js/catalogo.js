let productoSeleccionado = null;
let cantidadSeleccionada = 1;

document.addEventListener("DOMContentLoaded", function () {
  llenarSelectCategorias();

  pintarProductos(obtenerProductosFiltrados());
  configurarEventosFiltros();
  configurarEventosModal();
});


function llenarSelectCategorias() {
  const select = document.getElementById("filtro-categoria");
  if (!select) return;

  categorias.forEach(function (nombreCategoria) {
    const opcion = document.createElement("option");
    opcion.value = nombreCategoria;
    opcion.textContent = nombreCategoria;
    select.appendChild(opcion);
  });


  M.FormSelect.init(select);
}




function configurarEventosFiltros() {
  document.getElementById("filtro-categoria").addEventListener("change", refiltrar);
  document.getElementById("filtro-tipo").addEventListener("change", refiltrar);
  document.getElementById("filtro-orden").addEventListener("change", refiltrar);
}

function refiltrar() {
  pintarProductos(obtenerProductosFiltrados());
}


function obtenerProductosFiltrados() {
  const categoriaElegida = document.getElementById("filtro-categoria").value;
  const tipoElegido = document.getElementById("filtro-tipo").value;
  const orden = document.getElementById("filtro-orden").value;

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


function pintarProductos(listaProductos) {
  const contenedor = document.getElementById("grid-productos");
  const estadoVacio = document.getElementById("estado-vacio");
  const contador = document.getElementById("contador-resultados");

  contador.textContent = listaProductos.length + " producto(s) encontrado(s).";

  if (listaProductos.length === 0) {
    contenedor.innerHTML = "";
    estadoVacio.style.display = "block";
    return;
  }

  estadoVacio.style.display = "none";

  let html = "";
  listaProductos.forEach(function (producto) {
    html +=
      '<div class="col s12 m6 l3">' +
      '<div class="card producto-card" data-codigo="' + producto.codigo + '">' +
      '<div class="producto-media"><i class="material-icons">' + producto.icono + "</i></div>" +
      '<div class="card-content">' +
      '<span class="chip-categoria">' + producto.categoria + "</span>" +
      '<p class="producto-nombre">' + producto.nombre + "</p>" +
      '<p class="producto-desc">' + producto.descripcion + "</p>" +
      '<p class="producto-precio">$' + formatearPrecio(producto.precio) + "</p>" +
      "</div>" +
      "</div>" +
      "</div>";
  });

  contenedor.innerHTML = html;

  const tarjetas = contenedor.querySelectorAll(".producto-card");
  tarjetas.forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function () {
      const codigo = tarjeta.getAttribute("data-codigo");
      abrirModalProducto(codigo);
    });
  });
}


function configurarEventosModal() {
  document.getElementById("modal-menos").addEventListener("click", function () {
    if (cantidadSeleccionada > 1) {
      cantidadSeleccionada--;
      document.getElementById("modal-cantidad").textContent = cantidadSeleccionada;
    }
  });

  document.getElementById("modal-mas").addEventListener("click", function () {
    cantidadSeleccionada++;
    document.getElementById("modal-cantidad").textContent = cantidadSeleccionada;
  });

  document.getElementById("modal-agregar").addEventListener("click", function () {
    agregarProductoAlCarrito();
  });
}

function abrirModalProducto(codigo) {
  productoSeleccionado = buscarProductoPorCodigo(codigo);
  if (!productoSeleccionado) return;

  cantidadSeleccionada = 1;

  document.getElementById("modal-nombre").textContent = productoSeleccionado.nombre;
  document.getElementById("modal-descripcion").textContent = productoSeleccionado.descripcion;
  document.getElementById("modal-precio").textContent = "$" + formatearPrecio(productoSeleccionado.precio);
  document.getElementById("modal-cantidad").textContent = cantidadSeleccionada;
  document.getElementById("modal-mensaje").value = "";

  const puedePersonalizarTamano = productoSeleccionado.tipo !== null;
  document.getElementById("modal-tamano-wrapper").style.display = puedePersonalizarTamano ? "block" : "none";

  const instanciaModal = M.Modal.getInstance(document.getElementById("modal-producto"));
  instanciaModal.open();
}

function agregarProductoAlCarrito() {
  if (!productoSeleccionado) return;

  const mensaje = document.getElementById("modal-mensaje").value.trim();

  if (mensaje.length > 60) {
    mostrarError(document.getElementById("modal-mensaje"), "El mensaje no puede tener más de 60 caracteres.");
    return;
  }

  const tamano = document.getElementById("modal-tamano").value;

  const carrito = obtenerCarrito();


  const itemExistente = carrito.find(function (item) {
    return (
      item.codigo === productoSeleccionado.codigo &&
      item.tamano === tamano &&
      item.mensaje === mensaje
    );
  });

  if (itemExistente) {
    itemExistente.cantidad += cantidadSeleccionada;
  } else {
    carrito.push({
      codigo: productoSeleccionado.codigo,
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      tamano: tamano,
      mensaje: mensaje,
      cantidad: cantidadSeleccionada
    });
  }

  guardarCarrito(carrito);
  actualizarBadgeCarrito();

  const instanciaModal = M.Modal.getInstance(document.getElementById("modal-producto"));
  instanciaModal.close();

  M.toast({ html: productoSeleccionado.nombre + " se agregó al carrito." });
}

function obtenerCarrito() {
  const datos = localStorage.getItem("carrito");
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
