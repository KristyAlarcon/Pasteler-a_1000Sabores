import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import App_alert from "../../alert/alert";
import styles from "./formulario.module.css";

function Formulario({ campos, titulo, textoBoton, className, onGuardar, onCambio, valoresIniciales = {}, children, pie }){
    // Valores de todos los campos: { idCampo: valor }
    const [valores, setValores] = useState(() => {
        const iniciales = {};
        campos.forEach((campo) => {
            // Si viene un valor inicial (por ejemplo, al editar), se usa ese
            if (valoresIniciales[campo.id] !== undefined) iniciales[campo.id] = valoresIniciales[campo.id];
            else if (campo.type === "checkbox") iniciales[campo.id] = false;
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
        <Form className={className} noValidate onSubmit={guardar}>
            {titulo && <h5 className={styles.titulo}>{titulo}</h5>}

            <div className="row">
                {campos.map((campo) => {
                    if (campo.type === "checkbox") {
                        return (
                            <Form.Group className="col-12 mb-3" key={campo.id}>
                                <Form.Check type="checkbox" id={campo.id} label={campo.label}
                                    checked={valores[campo.id]}
                                    onChange={(e) => cambiar(campo.id, e.target.checked)} />
                            </Form.Group>
                        );
                    }

                    if (campo.type === "select") {
                        return (
                            <Form.Group className={(campo.col || "col-12") + " mb-3"} controlId={campo.id} key={campo.id}>
                                <Form.Label>{campo.label}</Form.Label>
                                <Form.Select value={valores[campo.id]} onChange={(e) => cambiar(campo.id, e.target.value)}>
                                    {campo.opciones.map((opcion) => (
                                        <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        );
                    }

                    return (
                        <Form.Group className={(campo.col || "col-12") + " mb-3"} controlId={campo.id} key={campo.id}>
                            <Form.Label>{campo.label}</Form.Label>
                            <Form.Control type={campo.type || "text"}
                                placeholder={campo.placeholder}
                                value={valores[campo.id]}
                                onChange={(e) => cambiar(campo.id, e.target.value)} />
                            {campo.ayuda && <Form.Text className="texto-secundario">{campo.ayuda}</Form.Text>}
                        </Form.Group>
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

            <Button type="submit" size="lg" className={styles.boton}>
                {textoBoton}
            </Button>

            {pie}
        </Form>
    );

}

export default Formulario;
