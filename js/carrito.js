

const COSTO_ENVIO = 3000;

document.addEventListener("DOMContentLoaded", function () {
  pintarCarrito();
  configurarBotonCheckout();
  configurarFormularioCheckout();
});


function obtenerCarrito() {
  const datos = localStorage.getItem("carrito");
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function pintarCarrito() {
  const carrito = obtenerCarrito();

  const bloqueVacio = document.getElementById("carrito-vacio");
  const bloqueConItems = document.getElementById("carrito-con-items");

  if (carrito.length === 0) {
    bloqueVacio.style.display = "block";
    bloqueConItems.style.display = "none";
    document.getElementById("bloque-checkout").style.display = "none";
    return;
  }

  bloqueVacio.style.display = "none";
  bloqueConItems.style.display = "flex";

  pintarListaItems(carrito);
  pintarResumen(carrito);
}

function pintarListaItems(carrito) {
  const contenedor = document.getElementById("lista-items");
  let html = "";

  carrito.forEach(function (item, indice) {
    const subtotalItem = item.precio * item.cantidad;

    html +=
      '<div class="fila-carrito" data-indice="' + indice + '">' +
      '<div class="icono-mini"><i class="material-icons">cake</i></div>' +
      '<div style="flex:1">' +
      "<p style=\"font-weight:700;margin:0\">" + item.nombre + "</p>" +
      (item.tamano ? '<p class="texto-secundario" style="margin:2px 0">Tamaño: ' + item.tamano + "</p>" : "") +
      (item.mensaje ? '<p class="texto-secundario" style="margin:2px 0">Mensaje: "' + item.mensaje + '"</p>' : "") +
      '<p class="texto-secundario" style="margin:2px 0">$' + formatearPrecio(item.precio) + " c/u</p>" +
      "</div>" +
      '<div class="cantidad-control">' +
      '<button type="button" class="btn-restar">−</button>' +
      "<span>" + item.cantidad + "</span>" +
      '<button type="button" class="btn-sumar">+</button>' +
      "</div>" +
      '<p style="font-weight:700;width:90px;text-align:right">$' + formatearPrecio(subtotalItem) + "</p>" +
      '<a href="#" class="btn-eliminar" title="Eliminar"><i class="material-icons">delete</i></a>' +
      "</div>";
  });

  contenedor.innerHTML = html;


  const filas = contenedor.querySelectorAll(".fila-carrito");
  filas.forEach(function (fila) {
    const indice = parseInt(fila.getAttribute("data-indice"));

    fila.querySelector(".btn-sumar").addEventListener("click", function () {
      cambiarCantidad(indice, 1);
    });

    fila.querySelector(".btn-restar").addEventListener("click", function () {
      cambiarCantidad(indice, -1);
    });

    fila.querySelector(".btn-eliminar").addEventListener("click", function (evento) {
      evento.preventDefault();
      eliminarItem(indice);
    });
  });
}

function cambiarCantidad(indice, cambio) {
  const carrito = obtenerCarrito();
  carrito[indice].cantidad += cambio;

  if (carrito[indice].cantidad < 1) {
    carrito[indice].cantidad = 1;
  }

  guardarCarrito(carrito);
  pintarCarrito();
  actualizarBadgeCarrito();
}

function eliminarItem(indice) {
  const carrito = obtenerCarrito();
  carrito.splice(indice, 1);
  guardarCarrito(carrito);
  pintarCarrito();
  actualizarBadgeCarrito();
}


function calcularSubtotal(carrito) {
  let subtotal = 0;
  carrito.forEach(function (item) {
    subtotal += item.precio * item.cantidad;
  });
  return subtotal;
}

function obtenerPorcentajeDescuento() {
  const sesion = obtenerSesion();
  if (!sesion) return 0;
  return sesion.descuentoFinal || 0;
}

function pintarResumen(carrito) {
  const subtotal = calcularSubtotal(carrito);
  const porcentajeDescuento = obtenerPorcentajeDescuento();
  const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
  const total = subtotal - montoDescuento + COSTO_ENVIO;

  document.getElementById("resumen-subtotal").textContent = "$" + formatearPrecio(subtotal);
  document.getElementById("resumen-envio").textContent = "$" + formatearPrecio(COSTO_ENVIO);
  document.getElementById("resumen-total").textContent = "$" + formatearPrecio(total);

  const filaDescuento = document.getElementById("fila-descuento");
  const avisoSinSesion = document.getElementById("aviso-sin-sesion");

  if (porcentajeDescuento > 0) {
    filaDescuento.style.display = "flex";
    document.getElementById("texto-descuento").textContent = "Descuento (" + porcentajeDescuento + "%)";
    document.getElementById("resumen-descuento").textContent = "-$" + formatearPrecio(montoDescuento);
    avisoSinSesion.classList.remove("activo");
  } else {
    filaDescuento.style.display = "none";
  }


  const sesion = obtenerSesion();
  if (sesion) {
    avisoSinSesion.style.display = "none";
  } else {
    avisoSinSesion.style.display = "flex";
  }
}

function configurarBotonCheckout() {
  const boton = document.getElementById("btn-ir-checkout");
  if (!boton) return;

  boton.addEventListener("click", function (evento) {
    evento.preventDefault();
    document.getElementById("bloque-checkout").style.display = "block";
    document.getElementById("bloque-checkout").scrollIntoView({ behavior: "smooth" });
  });
}

function configurarFormularioCheckout() {
  const formulario = document.getElementById("form-checkout");
  if (!formulario) return;

  const campoDireccion = document.getElementById("c-direccion");
  const campoFecha = document.getElementById("c-fecha");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const direccionValida = validarCampoDireccion(campoDireccion);
    const fechaValida = validarCampoFecha(campoFecha);

    if (!direccionValida || !fechaValida) {
      M.toast({ html: "Revisa los campos marcados en rojo." });
      return;
    }

    generarBoleta();
  });

  function validarCampoDireccion(input) {
    const resultado = validarTexto(input.value, true, 300);
    if (!resultado.valido) {
      mostrarError(input, resultado.mensaje);
      return false;
    }
    marcarValido(input);
    return true;
  }

  function validarCampoFecha(input) {
    if (input.value.length === 0) {
      mostrarError(input, "Debes elegir una fecha de entrega.");
      return false;
    }

    const fechaElegida = new Date(input.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaElegida < hoy) {
      mostrarError(input, "La fecha no puede ser anterior a hoy.");
      return false;
    }

    marcarValido(input);
    return true;
  }
}

function generarBoleta() {
  const carrito = obtenerCarrito();
  const subtotal = calcularSubtotal(carrito);
  const porcentajeDescuento = obtenerPorcentajeDescuento();
  const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
  const total = subtotal - montoDescuento + COSTO_ENVIO;

  const numeroPedido = Math.floor(Math.random() * 900000) + 100000;
  const fechaHoy = new Date();
  const fechaEntrega = document.getElementById("c-fecha").value;
  const direccion = document.getElementById("c-direccion").value;

  document.getElementById("boleta-id").textContent = numeroPedido;
  document.getElementById("boleta-fecha").textContent = "Emitida el " + fechaHoy.toLocaleDateString("es-CL");
  document.getElementById("boleta-direccion").textContent = direccion;
  document.getElementById("boleta-fecha-entrega").textContent = new Date(fechaEntrega).toLocaleDateString("es-CL");

  let htmlItems = "";
  carrito.forEach(function (item) {
    htmlItems +=
      '<div class="resumen-linea">' +
      "<span>" + item.cantidad + "x " + item.nombre + "</span>" +
      "<span>$" + formatearPrecio(item.precio * item.cantidad) + "</span>" +
      "</div>";
  });
  document.getElementById("boleta-items").innerHTML = htmlItems;

  document.getElementById("boleta-subtotal").textContent = "$" + formatearPrecio(subtotal);
  document.getElementById("boleta-envio").textContent = "$" + formatearPrecio(COSTO_ENVIO);
  document.getElementById("boleta-total").textContent = "$" + formatearPrecio(total);

  const filaDescuentoBoleta = document.getElementById("boleta-fila-descuento");
  if (porcentajeDescuento > 0) {
    filaDescuentoBoleta.style.display = "flex";
    document.getElementById("boleta-descuento").textContent = "-$" + formatearPrecio(montoDescuento);
  } else {
    filaDescuentoBoleta.style.display = "none";
  }

  guardarCarrito([]);
  actualizarBadgeCarrito();

  document.getElementById("vista-carrito").style.display = "none";
  document.getElementById("vista-confirmacion").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
