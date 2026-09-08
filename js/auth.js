

// Devuelve el arreglo de usuarios guardados (o un arreglo vacío)
function obtenerUsuarios() {
  const datosGuardados = localStorage.getItem("usuarios");
  if (!datosGuardados) {
    return [];
  }
  return JSON.parse(datosGuardados);
}

// Guarda el arreglo completo de usuarios en localStorage
function guardarUsuarios(listaUsuarios) {
  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}

// Revisa si ya existe una cuenta registrada con ese correo
function existeCorreo(correo) {
  const usuarios = obtenerUsuarios();
  const correoBuscado = correo.trim().toLowerCase();

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correoBuscado) {
      return true;
    }
  }
  return false;
}


function calcularEdad(fechaNacimientoTexto) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimientoTexto);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();


  const noHaCumplidoAnosEsteAno =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

  if (noHaCumplidoAnosEsteAno) {
    edad = edad - 1;
  }

  return edad;
}


function esCumpleanosHoy(fechaNacimientoTexto) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimientoTexto);

  return (
    hoy.getDate() === nacimiento.getDate() &&
    hoy.getMonth() === nacimiento.getMonth()
  );
}


function calcularBeneficios(datos) {
  let descuentoPorEdad = 0;
  let descuentoPorCodigo = 0;
  let esMayorDe50 = false;


  if (datos.fechaNacimiento) {
    const edad = calcularEdad(datos.fechaNacimiento);
    if (edad > 50) {
      descuentoPorEdad = 50;
      esMayorDe50 = true;
    }
  }


  if (datos.codigo && datos.codigo.trim().toUpperCase() === "FELICES50") {
    descuentoPorCodigo = 10;
  }

  const descuentoFinal = Math.max(descuentoPorEdad, descuentoPorCodigo);


  const correoMinuscula = datos.correo ? datos.correo.trim().toLowerCase() : "";
  const esCorreoDuoc =
    correoMinuscula.endsWith("@duoc.cl") || correoMinuscula.endsWith("@profesor.duoc.cl");

  let tortaCumpleanosHoy = false;
  if (esCorreoDuoc && datos.fechaNacimiento && esCumpleanosHoy(datos.fechaNacimiento)) {
    tortaCumpleanosHoy = true;
  }

  return {
    esMayorDe50: esMayorDe50,
    tieneCodigoFelices50: descuentoPorCodigo > 0,
    esEstudianteDuoc: esCorreoDuoc,
    descuentoFinal: descuentoFinal,
    tortaCumpleanosHoy: tortaCumpleanosHoy
  };
}


function registrarUsuario(datosFormulario) {
  const beneficios = calcularBeneficios(datosFormulario);

  const nuevoUsuario = {
    nombre: datosFormulario.nombre.trim(),
    apellido: datosFormulario.apellido.trim(),
    run: datosFormulario.run,
    correo: datosFormulario.correo.trim().toLowerCase(),

    password: datosFormulario.password,
    fechaNacimiento: datosFormulario.fechaNacimiento || null,
    esEstudianteDuoc: beneficios.esEstudianteDuoc,
    descuentoFinal: beneficios.descuentoFinal
  };

  const usuarios = obtenerUsuarios();
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  return { usuario: nuevoUsuario, beneficios: beneficios };
}


function guardarSesion(usuario) {
  localStorage.setItem("sesion", JSON.stringify(usuario));
}

function obtenerSesion() {
  const datos = localStorage.getItem("sesion");
  if (!datos) {
    return null;
  }
  return JSON.parse(datos);
}

function cerrarSesion() {
  localStorage.removeItem("sesion");
}

function iniciarSesion(correo, password) {
  const usuarios = obtenerUsuarios();
  const correoBuscado = correo.trim().toLowerCase();

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correoBuscado) {
      if (usuarios[i].password === password) {
        guardarSesion(usuarios[i]);
        return { exito: true, usuario: usuarios[i] };
      }
      return { exito: false, mensaje: "La contraseña es incorrecta." };
    }
  }

  return { exito: false, mensaje: "No existe una cuenta con ese correo." };
}
