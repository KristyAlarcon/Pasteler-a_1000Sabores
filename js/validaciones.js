
function mostrarError(input, mensaje) {
  const contenedor = input.closest(".input-field");
  if (!contenedor) return;

  contenedor.classList.add("invalido");
  contenedor.classList.remove("valido");

  const cajaError = contenedor.querySelector(".mensaje-error");
  if (cajaError) {
    cajaError.textContent = mensaje;
    cajaError.classList.add("activo");
  }
}

function marcarValido(input) {
  const contenedor = input.closest(".input-field");
  if (!contenedor) return;

  contenedor.classList.remove("invalido");
  contenedor.classList.add("valido");

  const cajaError = contenedor.querySelector(".mensaje-error");
  if (cajaError) {
    cajaError.textContent = "";
    cajaError.classList.remove("activo");
  }
}

function validarTexto(valor, requerido, maximo) {
  const texto = valor.trim();

  if (requerido && texto.length === 0) {
    return { valido: false, mensaje: "Este campo es obligatorio." };
  }

  if (maximo && texto.length > maximo) {
    return { valido: false, mensaje: "Máximo " + maximo + " caracteres." };
  }

  return { valido: true, mensaje: "" };
}


function validarCorreo(valor, requerido, maximo) {
  const correo = valor.trim().toLowerCase();

  if (requerido && correo.length === 0) {
    return { valido: false, mensaje: "El correo es obligatorio." };
  }

  if (maximo && correo.length > maximo) {
    return { valido: false, mensaje: "Máximo " + maximo + " caracteres." };
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (correo.length > 0 && !formatoEmail.test(correo)) {
    return {
      valido: false,
      mensaje: "Ingrese un correo con formato válido (ejemplo@dominio.com)."
    };
  }

  return { valido: true, mensaje: "" };
}


function validarPassword(valor) {
  const clave = valor.trim();

  if (clave.length === 0) {
    return { valido: false, mensaje: "La contraseña es obligatoria." };
  }

  if (clave.length < 4 || clave.length > 10) {
    return { valido: false, mensaje: "Debe tener entre 4 y 10 caracteres." };
  }

  return { valido: true, mensaje: "" };
}




