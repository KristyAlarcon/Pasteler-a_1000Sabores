function validarRegistro(usuario) {
    const { edad, codigoDescuento, correo, fechaNacimiento } = usuario;
    
    let descuento = 0;
    let beneficios = [];
    
    // 1. Descuento del 50% para mayores de 50 años
    if (edad > 50) {
        descuento = 50;
        beneficios.push("Descuento del 50% por edad");
    }
    
    // 2. Descuento del 10% de por vida con código "FELICES50"
    if (codigoDescuento === "FELICES50") {
        descuento = Math.max(descuento, 10); // Usa el mayor descuento disponible
        beneficios.push("Descuento del 10% de por vida");
    }
    
    // 3. Torta gratis para estudiantes Duoc en su cumpleaños
    const esEstudianteDuoc = correo.endsWith("@duoc.cl") || correo.endsWith("@duocuc.cl");
    const esSuCumpleanos = esCumpleanos(fechaNacimiento);
    
    if (esEstudianteDuoc && esSuCumpleanos) {
        beneficios.push("¡Torta gratis de cumpleaños!");
    }
    
    return {
        descuentoAplicable: descuento,
        beneficios: beneficios,
        mensaje: generarMensaje(descuento, beneficios)
    };
}

// Función auxiliar para verificar si hoy es el cumpleaños
function esCumpleanos(fechaNacimiento) {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    
    return hoy.getDate() === cumpleanos.getDate() && 
           hoy.getMonth() === cumpleanos.getMonth();
}

// Función para generar mensaje personalizado
function generarMensaje(descuento, beneficios) {
    if (beneficios.length === 0) {
        return "¡Registro completado!";
    }
    
    let mensaje = "¡Felicitaciones! Tienes los siguientes beneficios:\n";
    beneficios.forEach(beneficio => {
        mensaje += `- ${beneficio}\n`;
    });
    
    if (descuento > 0) {
        mensaje += `Tu descuento total es: ${descuento}%`;
    }
    
    return mensaje;
}

// Ejemplo de uso
const usuario1 = {
    edad: 55,
    codigoDescuento: "",
    correo: "juan@gmail.com",
    fechaNacimiento: "1969-01-15"
};

const usuario2 = {
    edad: 25,
    codigoDescuento: "FELICES50",
    correo: "maria@duoc.cl",
    fechaNacimiento: new Date() // Hoy es su cumpleaños
};

console.log("Usuario 1:", validarRegistro(usuario1));
console.log("Usuario 2:", validarRegistro(usuario2));