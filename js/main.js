
document.addEventListener("DOMContentLoaded", function () {
  inicializarMaterialize();
  pintarAnioActual();
  pintarMenuUsuario();
  actualizarBadgeCarrito();
});

function inicializarMaterialize() {
  const menusLaterales = document.querySelectorAll(".sidenav");
  M.Sidenav.init(menusLaterales);

  const selects = document.querySelectorAll("select");
  M.FormSelect.init(selects);

  const modales = document.querySelectorAll(".modal");
  M.Modal.init(modales);
}


function pintarAnioActual() {
  const anioActual = new Date().getFullYear();
  const espacios = document.querySelectorAll(".anio-actual");

  espacios.forEach(function (espacio) {
    espacio.textContent = anioActual;
  });
}


function pintarMenuUsuario() {
  const contenedor = document.getElementById("nav-usuario");
  if (!contenedor) return;

  const sesion = obtenerSesion();

  if (sesion) {
    contenedor.innerHTML =
      '<li><a href="#!" class="no-link">Hola, ' + sesion.nombre + "</a></li>" +
      '<li><a href="#" id="btn-cerrar-sesion">Cerrar sesión</a></li>';

    const botonCerrar = document.getElementById("btn-cerrar-sesion");
    botonCerrar.addEventListener("click", function (evento) {
      evento.preventDefault();
      cerrarSesion();
      window.location.href = "index.html";
    });
  } else {
    contenedor.innerHTML =
      '<li><a href="login.html">Iniciar sesión</a></li>' +
      '<li><a href="registro.html">Regístrate</a></li>';
  }
}


function contarProductosEnCarrito() {
  const datos = localStorage.getItem("carrito");
  if (!datos) return 0;

  const carrito = JSON.parse(datos);
  let total = 0;

  carrito.forEach(function (item) {
    total += item.cantidad;
  });

  return total;
}


function actualizarBadgeCarrito() {
  const badge = document.getElementById("carrito-badge");
  if (!badge) return;

  badge.textContent = contarProductosEnCarrito();
}
