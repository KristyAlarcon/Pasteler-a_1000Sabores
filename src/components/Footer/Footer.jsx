import { Link } from "react-router-dom";
import styles from "./footer.module.css";

// completo = true muestra las columnas de información (como en la página de inicio)
function Footer({ completo = false }){
    const anioActual = new Date().getFullYear();

    return(
        <footer className={styles.footer}>
            {completo && (
                <div className={"container " + styles.columnas}>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <h5 className={styles.titulo}>Mil Sabores</h5>
                            <p className={styles.textoClaro}>50 años de tradición repostera chilena, ahora online.</p>
                        </div>
                        <div className="col-12 col-md-4">
                            <h5 className={styles.titulo}>Navegación</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/Catalogo" className={styles.enlace}>Catálogo</Link></li>
                                <li><Link to="/Registro" className={styles.enlace}>Crear cuenta</Link></li>
                                <li><Link to="/Carrito" className={styles.enlace}>Carrito</Link></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-4">
                            <h5 className={styles.titulo}>Contacto</h5>
                            <p className={styles.textoClaro}>Santiago, Chile · hola@milsabores.cl</p>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.copyright}>
                <div className="container">
                    © <span className="anio-actual">{anioActual}</span> Pastelería Mil Sabores{completo && " — Proyecto académico Duoc UC"}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
