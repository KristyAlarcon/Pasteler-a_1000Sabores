

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("form-registro");
  if (!formulario) return;

  const campoNombre = document.getElementById("nombre");
  const campoApellido = document.getElementById("apellido");
  const campoRun = document.getElementById("run");
  const campoFechaNacimiento = document.getElementById("fecha-nacimiento");
  const campoEmail = document.getElementById("email");
  const campoPassword = document.getElementById("password");
  const campoPassword2 = document.getElementById("password2");
  const campoCodigo = document.getElementById("codigo");
  const campoTerminos = document.getElementById("terminos");


  campoNombre.addEventListener("blur", function () {
    validarCampoNombre(campoNombre);
  });

  campoApellido.addEventListener("blur", function () {
    validarCampoApellido(campoApellido);
  });


  campoEmail.addEventListener("blur", function () {
    validarCampoEmail(campoEmail);
  });

  campoPassword.addEventListener("blur", function () {
    validarCampoPassword(campoPassword);
  });

  campoPassword2.addEventListener("blur", function () {
    validarCampoPassword2(campoPassword, campoPassword2);
  });


  campoFechaNacimiento.addEventListener("change", actualizarAvisos);
  campoEmail.addEventListener("input", actualizarAvisos);
  campoCodigo.addEventListener("input", actualizarAvisos);


  function actualizarAvisos() {
    const beneficios = calcularBeneficios({
      correo: campoEmail.value,
      fechaNacimiento: campoFechaNacimiento.value,
      codigo: campoCodigo.value
    });

    mostrarOcultarAviso("aviso-50", beneficios.esMayorDe50);
    mostrarOcultarAviso("aviso-10", beneficios.tieneCodigoFelices50);
    mostrarOcultarAviso(
      "aviso-torta",
      beneficios.esEstudianteDuoc && campoFechaNacimiento.value.length > 0
    );
  }

  function mostrarOcultarAviso(idAviso, mostrar) {
    const aviso = document.getElementById(idAviso);
    if (!aviso) return;

    if (mostrar) {
      aviso.classList.add("activo");
    } else {
      aviso.classList.remove("activo");
    }
  }


  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreValido = validarCampoNombre(campoNombre);
    const apellidoValido = validarCampoApellido(campoApellido);
    const emailValido = validarCampoEmail(campoEmail);
    const passwordValida = validarCampoPassword(campoPassword);
    const password2Valida = validarCampoPassword2(campoPassword, campoPassword2);
    const terminosAceptados = validarCampoTerminos(campoTerminos);

    const formularioValido =
      nombreValido &&
      apellidoValido &&
 
      emailValido &&
      passwordValida &&
      password2Valida &&
      terminosAceptados;

    if (!formularioValido) {
      M.toast({ html: "Revisa los campos marcados en rojo." });
      return;
    }

    // No permitir dos cuentas con el mismo correo
    if (existeCorreo(campoEmail.value)) {
      mostrarError(campoEmail, "Ya existe una cuenta registrada con ese correo.");
      return;
    }

    const resultado = registrarUsuario({
      nombre: campoNombre.value,
      apellido: campoApellido.value,
      run: campoRun.value,
      correo: campoEmail.value,
      password: campoPassword.value,
      fechaNacimiento: campoFechaNacimiento.value,
      codigo: campoCodigo.value
    });

    guardarSesion(resultado.usuario);

    M.toast({ html: "¡Cuenta creada con éxito! Bienvenido/a " + resultado.usuario.nombre + "." });

    setTimeout(function () {
      window.location.href = "catalogo.html";
    }, 1200);
  });




  function validarCampoNombre(input) {
    const resultado = validarTexto(input.value, true, 50);
    if (!resultado.valido) {
      mostrarError(input, resultado.mensaje);
      return false;
    }
    marcarValido(input);
    return true;
  }

  function validarCampoApellido(input) {
    const resultado = validarTexto(input.value, true, 100);
    if (!resultado.valido) {
      mostrarError(input, resultado.mensaje);
      return false;
    }
    marcarValido(input);
    return true;
  }


  function validarCampoEmail(input) {
    const resultado = validarCorreo(input.value, true, 100);
    if (!resultado.valido) {
      mostrarError(input, resultado.mensaje);
      return false;
    }
    marcarValido(input);
    return true;
  }

  function validarCampoPassword(input) {
    const resultado = validarPassword(input.value);
    if (!resultado.valido) {
      mostrarError(input, resultado.mensaje);
      return false;
    }
    marcarValido(input);
    return true;
  }

  function validarCampoPassword2(inputPassword, inputPassword2) {
    if (inputPassword2.value.trim().length === 0) {
      mostrarError(inputPassword2, "Debes confirmar tu contraseña.");
      return false;
    }
    if (inputPassword2.value !== inputPassword.value) {
      mostrarError(inputPassword2, "Las contraseñas no coinciden.");
      return false;
    }
    marcarValido(inputPassword2);
    return true;
  }

  function validarCampoTerminos(input) {
    const cajaError = document.getElementById("error-terminos");
    if (!input.checked) {
      if (cajaError) {
        cajaError.textContent = "Debes aceptar los términos y condiciones.";
        cajaError.classList.add("activo");
      }
      return false;
    }
    if (cajaError) {
      cajaError.textContent = "";
      cajaError.classList.remove("activo");
    }
    return true;
  }
});
