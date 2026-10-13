import { useState } from "react";
import App_alert from "../../alert/alert";
import styles from "./formulario.module.css";

function Formulario({ campos, titulo, textoBoton, className, onGuardar, onCambio, children, pie }){
    // Valores de todos los campos: { idCampo: valor }
    const [valores, setValores] = useState(() => {
        const iniciales = {};
        campos.forEach((campo) => {
            if (campo.type === "checkbox") iniciales[campo.id] = false;
            else if (campo.type === "select") iniciales[campo.id] = campo.opciones[0].valor;
            else iniciales[campo.id] = "";
        });
        return iniciales;
    });

    // Como mostrar las alertas de bootstrap
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mostrarMensaje, setMostrarMensaje] = useState("");
    const [variante, setVariante] = useState("danger");

    function alerta(mensaje, variant = "danger"){
        setMostrarMensaje(mensaje);
        setVariante(variant);
        setMostrarAlerta(true);
    }

    function cambiar(id, valor){
        const nuevosValores = { ...valores, [id]: valor };
        setValores(nuevosValores);
        if (onCambio) onCambio(nuevosValores);
    }

    function guardar(evento){
        evento.preventDefault();
        setMostrarAlerta(false);
        // La página valida los valores y usa alerta() para mostrar el mensaje
        onGuardar(valores, alerta);
    }

    return(
        <form className={className} noValidate onSubmit={guardar}>
            {titulo && <h5 className={styles.titulo}>{titulo}</h5>}

            <div className={"row " + styles.fila}>
                {campos.map((campo) => {
                    if (campo.type === "checkbox") {
                        return (
                            <p className="col s12" key={campo.id}>
                                <label>
                                    <input type="checkbox" className="filled-in" id={campo.id}
                                        checked={valores[campo.id]}
                                        onChange={(e) => cambiar(campo.id, e.target.checked)} />
                                    <span>{campo.label}</span>
                                </label>
                            </p>
                        );
                    }

                    if (campo.type === "select") {
                        return (
                            <div className={"input-field " + (campo.col || "col s12")} key={campo.id}>
                                <select className="browser-default" id={campo.id}
                                    value={valores[campo.id]}
                                    onChange={(e) => cambiar(campo.id, e.target.value)}>
                                    {campo.opciones.map((opcion) => (
                                        <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
                                    ))}
                                </select>
                                <label htmlFor={campo.id} className="active">{campo.label}</label>
                            </div>
                        );
                    }

                    return (
                        <div className={"input-field " + (campo.col || "col s12")} key={campo.id}>
                            <input id={campo.id} type={campo.type || "text"}
                                placeholder={campo.placeholder}
                                value={valores[campo.id]}
                                onChange={(e) => cambiar(campo.id, e.target.value)} />
                            <label htmlFor={campo.id} className={campo.type === "date" || campo.placeholder ? "active" : ""}>{campo.label}</label>
                            {campo.ayuda && <span className="helper-text">{campo.ayuda}</span>}
                        </div>
                    );
                })}
            </div>

            {children}

            <App_alert
                mostrarAlert={mostrarAlerta}
                cerrarAlert={() => setMostrarAlerta(false)}
                variant={variante}
                msgAlert={mostrarMensaje}
            />

            <button type="submit" className={"btn btn-large waves-effect waves-light " + styles.boton}>
                {textoBoton}
            </button>

            {pie}
        </form>
    );

}

export default Formulario;
