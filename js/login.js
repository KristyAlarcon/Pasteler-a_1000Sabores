
document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("form-login");
  if (!formulario) return;

  const campoEmail = document.getElementById("email");
  const campoPassword = document.getElementById("password");

  campoEmail.addEventListener("blur", function () {
    validarCampoEmail();
  });

  campoPassword.addEventListener("blur", function () {
    validarCampoPassword();
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const emailValido = validarCampoEmail();
    const passwordValida = validarCampoPassword();

    if (!emailValido || !passwordValida) {
      M.toast({ html: "Revisa los campos marcados en rojo." });
      return;
    }

    const resultado = iniciarSesion(campoEmail.value, campoPassword.value);

    if (!resultado.exito) {
      mostrarError(campoEmail, resultado.mensaje);
      return;
    }

    M.toast({ html: "¡Bienvenido/a de nuevo, " + resultado.usuario.nombre + "!" });

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1000);
  });

  function validarCampoEmail() {
    const resultado = validarCorreo(campoEmail.value, true, 100);
    if (!resultado.valido) {
      mostrarError(campoEmail, resultado.mensaje);
      return false;
    }
    marcarValido(campoEmail);
    return true;
  }

  function validarCampoPassword() {
    const resultado = validarPassword(campoPassword.value);
    if (!resultado.valido) {
      mostrarError(campoPassword, resultado.mensaje);
      return false;
    }
    marcarValido(campoPassword);
    return true;
  }
});
