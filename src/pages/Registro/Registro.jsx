import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Formulario from "../../components/Formulario/formulario";
import styles from "./registro.module.css";

const camposRegistro = [
    { id: "nombre", label: "Nombre", col: "col-12 col-md-6" },
    { id: "apellido", label: "Apellido", col: "col-12 col-md-6" },
    { id: "run", label: "RUN", col: "col-12 col-md-6", placeholder: "12.345.678-9" },
    { id: "fechaNacimiento", label: "Fecha de nacimiento", col: "col-12 col-md-6", type: "date" },
    { id: "email", label: "Correo electrónico", type: "email", ayuda: "Si tienes correo institucional @duocuc.cl, recibirás una torta gratis en tu cumpleaños." },
    { id: "password", label: "Contraseña", col: "col-12 col-md-6", type: "password", ayuda: "Entre 4 y 10 caracteres." },
    { id: "password2", label: "Confirmar contraseña", col: "col-12 col-md-6", type: "password" },
    { id: "codigo", label: "Código promocional (opcional)", placeholder: "Ej: FELICES50", ayuda: "El código FELICES50 te da 10% de descuento de por vida." },
    { id: "terminos", label: "Acepto los términos y condiciones", type: "checkbox" }
];

function calcularEdad(fechaNacimientoTexto){
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

function calcularBeneficios(datos){
    let descuentoPorEdad = 0;
    let descuentoPorCodigo = 0;

    if (datos.fechaNacimiento && calcularEdad(datos.fechaNacimiento) > 50) {
        descuentoPorEdad = 50;
    }

    if (datos.codigo && datos.codigo.trim().toUpperCase() === "FELICES50") {
        descuentoPorCodigo = 10;
    }

    const correoMinuscula = datos.email ? datos.email.trim().toLowerCase() : "";
    const esCorreoDuoc =
        correoMinuscula.endsWith("@duoc.cl") || correoMinuscula.endsWith("@profesor.duoc.cl");

    return {
        esMayorDe50: descuentoPorEdad > 0,
        tieneCodigoFelices50: descuentoPorCodigo > 0,
        esEstudianteDuoc: esCorreoDuoc,
        descuentoFinal: Math.max(descuentoPorEdad, descuentoPorCodigo)
    };
}

function Registro(){
    const navigate = useNavigate();

    // Valores del formulario, usados para mostrar los avisos de beneficios
    const [datos, setDatos] = useState({});
    const beneficios = calcularBeneficios(datos);
    const mostrarAvisoTorta = beneficios.esEstudianteDuoc && Boolean(datos.fechaNacimiento);

    function validarTexto(valor, nombre, maximo, alerta){
        if (valor.trim().length == 0) {
            alerta("El " + nombre + " no debe de estar vacío.");
            return false;
        }
        if (valor.trim().length > maximo) {
            alerta("El " + nombre + " debe tener máximo " + maximo + " caracteres.");
            return false;
        }
        return true;
    }

    function validar(valores, alerta){
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (validarTexto(valores.nombre, "nombre", 50, alerta) == false) return false;
        if (validarTexto(valores.apellido, "apellido", 100, alerta) == false) return false;

        if (valores.fechaNacimiento.length == 0) {
            alerta("La fecha de nacimiento no debe de estar vacía.");
            return false;
        }
        if (new Date(valores.fechaNacimiento) > new Date()) {
            alerta("La fecha de nacimiento no puede ser posterior a hoy.");
            return false;
        }
        if (calcularEdad(valores.fechaNacimiento) > 120) {
            alerta("Ingresa una fecha de nacimiento válida.");
            return false;
        }

        if (valores.email.trim().length == 0) {
            alerta("El correo no debe de estar vacío.");
            return false;
        }
        if (!formatoEmail.test(valores.email.trim())) {
            alerta("Ingrese un correo con formato válido (ejemplo@dominio.com).");
            return false;
        }
        if (valores.password.trim().length < 4 || valores.password.trim().length > 10) {
            alerta("La contraseña debe tener entre 4 y 10 caracteres.");
            return false;
        }
        if (valores.password2 !== valores.password) {
            alerta("Las contraseñas no coinciden.");
            return false;
        }
        if (!valores.terminos) {
            alerta("Debes aceptar los términos y condiciones.");
            return false;
        }
        return true;
    }

    function registrarUsuario(valores, alerta){
        if (validar(valores, alerta) == false) {
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const correo = valores.email.trim().toLowerCase();

        // No permitir dos cuentas con el mismo correo
        if (usuarios.some((u) => u.correo === correo)) {
            alerta("Ya existe una cuenta registrada con ese correo.");
            return;
        }

        const beneficiosUsuario = calcularBeneficios(valores);

        const nuevoUsuario = {
            nombre: valores.nombre.trim(),
            apellido: valores.apellido.trim(),
            run: valores.run,
            correo: correo,
            password: valores.password,
            fechaNacimiento: valores.fechaNacimiento || null,
            esEstudianteDuoc: beneficiosUsuario.esEstudianteDuoc,
            descuentoFinal: beneficiosUsuario.descuentoFinal
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("sesion", JSON.stringify(nuevoUsuario));

        alerta("¡Cuenta creada con éxito! Bienvenido/a " + nuevoUsuario.nombre + ".", "success");

        setTimeout(function () {
            navigate('/Catalogo');
        }, 1200);
    }

    return(
        <>
            <Navbar/>

            <section>
                <div className="container">
                    <div className={"text-center " + styles.encabezado}>
                        <h1 className={styles.titulo}>Crea tu cuenta</h1>
                        <p className="texto-secundario">Regístrate y descubre al instante los beneficios que te corresponden.</p>
                    </div>

                    <Formulario
                        className="form-card"
                        campos={camposRegistro}
                        textoBoton="Crear cuenta"
                        onGuardar={registrarUsuario}
                        onCambio={setDatos}
                        pie={
                            <p className={"text-center " + styles.pie}>
                                ¿Ya tienes cuenta? <Link to="/Login">Inicia sesión</Link>
                            </p>
                        }
                    >
                        <div className={"aviso-descuento bg-50" + (beneficios.esMayorDe50 ? " activo" : "")} id="aviso-50">
                            <i className="material-icons">redeem</i>
                            <span>¡Felicidades! Por ser mayor de 50 años, tendrás <strong>50% de descuento</strong> en todos tus pedidos.</span>
                        </div>
                        <div className={"aviso-descuento bg-10" + (beneficios.tieneCodigoFelices50 ? " activo" : "")} id="aviso-10">
                            <i className="material-icons">local_offer</i>
                            <span>Código válido: obtendrás <strong>10% de descuento de por vida</strong> en tus compras.</span>
                        </div>
                        <div className={"aviso-descuento bg-torta" + (mostrarAvisoTorta ? " activo" : "")} id="aviso-torta">
                            <i className="material-icons">cake</i>
                            <span>Correo institucional detectado: tendrás una <strong>torta de cumpleaños gratis</strong> cada año.</span>
                        </div>
                    </Formulario>
                </div>
            </section>

            <Footer/>
        </>
    );

}

export default Registro
