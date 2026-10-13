import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Formulario from "../../components/Formulario/formulario";
import styles from "./login.module.css";

const camposLogin = [
    { id: "email", label: "Correo electrónico", type: "email" },
    { id: "password", label: "Contraseña", type: "password" }
];

function Login(){
    const navigate = useNavigate();

    function validar(valores, alerta){
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        return true;
    }

    function iniciarSesion(valores, alerta){
        if (validar(valores, alerta) == false) {
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuario = usuarios.find((u) => u.correo === valores.email.trim().toLowerCase());

        if (!usuario) {
            alerta("No existe una cuenta con ese correo.");
            return;
        }
        if (usuario.password !== valores.password) {
            alerta("La contraseña es incorrecta.");
            return;
        }

        localStorage.setItem("sesion", JSON.stringify(usuario));
        alerta("¡Bienvenido/a de nuevo, " + usuario.nombre + "!", "success");

        setTimeout(function () {
            navigate('/');
        }, 1000);
    }

    return(
        <>
            <Navbar/>

            <section>
                <div className="container">
                    <div className={"center-align " + styles.encabezado}>
                        <h1 className={styles.titulo}>Inicia sesión</h1>
                        <p className="texto-secundario">Accede a tu cuenta para ver tus beneficios y pedidos.</p>
                    </div>

                    <Formulario
                        className="form-card"
                        campos={camposLogin}
                        textoBoton="Entrar"
                        onGuardar={iniciarSesion}
                        pie={
                            <p className={"center-align " + styles.pie}>
                                ¿Aún no tienes cuenta? <Link to="/Registro">Regístrate aquí</Link>
                            </p>
                        }
                    />
                </div>
            </section>

            <Footer/>
        </>
    );

}

export default Login
