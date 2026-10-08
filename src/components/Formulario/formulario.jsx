import {useState } from "react";
import App_alert from "../../alert/alert";

function Formulario(){
    const [txtnombre, setTxtnombre] = useState("");
    const [txtedad, setTxtedad] = useState("");


    // Como mostrar las alertas de bootstrap
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    // NOMBRE DE LA VARIABLE
    const [mostrarMensaje, setMostrarMensaje] = useState("");

    function validarTexto(valor, nombre){
        if(valor.length == 0){
            setMostrarMensaje("El "+ nombre+ " no debe de estar vacio");
            setMostrarAlerta(true)
        }else  
            return true;
    }
    function validarNumero(valor, nombre){
        if(valor < 0 || valor == 0){
            alert("la "+ nombre + " no debe de ser menor o igual a 0");
            return false
        }else  
            return true;
    }

    function guardar(){
        if(validarTexto(txtnombre,"nombre") ==false){
            return
        }else if(validarNumero(txtedad, "numero") == false){
            return

        }else{
            console.log("GUARDANDOO!!")
        }
    }

    return(
        <App_alert>
        
        </>
    );

}

export default Formulario;