import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./inicio.module.css";

function Inicio(){
    return(
        <>
            <Navbar/>


            <header className={styles.hero}>
                <div className="container">
                    <div className={"row align-items-center " + styles.filaHero}>
                        <div className="col-12 col-md-7">
                            <span className={styles.heroEyebrow}>50 años de tradición repostera</span>
                            <h1>Endulzamos Chile desde 1975</h1>
                            <p className={styles.heroSub}>
                                Tortas, postres y pastelería tradicional hechos con historia y cariño.
                                Ahora puedes personalizar tu pedido, seguir tu envío y celebrar con
                                nosotros desde la comodidad de tu casa.
                            </p>
                            <div className={styles.heroBadgeGuinness}>
                                <i className="material-icons">emoji_events</i>
                                Récord Guinness 1995 — colaboramos en la torta más grande del mundo
                            </div>
                            <div className={styles.botonesHero}>
                                <Link to="/Catalogo" className="btn btn-lg btn-primary">Ver catálogo</Link>{" "}
                                <Link to="/Registro" className={"btn btn-lg btn-outline-primary " + styles.botonSecundario}>Crear cuenta y ahorrar</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-5 text-center d-none d-md-block">
                            <i className={"material-icons " + styles.iconoHero}>cake</i>
                        </div>
                    </div>
                </div>
            </header>


            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <div className={styles.mvCard}>
                                <i className="material-icons">history_edu</i>
                                <h5>Nuestra historia</h5>
                                <p className="texto-secundario">
                                    Pastelería 1000 Sabores celebra su 50° aniversario como referente
                                    de la repostería chilena, renovando hoy su forma de vender online.
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className={styles.mvCard}>
                                <i className="material-icons">favorite</i>
                                <h5>Misión</h5>
                                <p className="texto-secundario">
                                    Ofrecer una experiencia dulce y memorable, con productos de alta
                                    calidad para todas las ocasiones, celebrando nuestras raíces.
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className={styles.mvCard}>
                                <i className="material-icons">auto_awesome</i>
                                <h5>Visión</h5>
                                <p className="texto-secundario">
                                    Ser la tienda online líder en repostería en Chile, conocida por
                                    innovar y aportar a la formación de nuevos talentos gastronómicos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="alt">
                <div className="container">
                    <h2 className="section-title">Beneficios para nuestra comunidad</h2>
                    <p className="section-kicker">Regístrate y accede automáticamente a estos beneficios.</p>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <div className="card card-body suave text-center">
                                <i className={"material-icons " + styles.iconoBeneficio}>redeem</i>
                                <h5>50% de descuento</h5>
                                <p className="texto-secundario">Para todas las personas mayores de 50 años, en todos los productos, todos los días.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="card card-body suave text-center">
                                <i className={"material-icons " + styles.iconoBeneficio}>local_offer</i>
                                <h5>10% de por vida</h5>
                                <p className="texto-secundario">Regístrate con el código <strong>FELICES50</strong> y obtén 10% de descuento permanente.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="card card-body suave text-center">
                                <i className={"material-icons " + styles.iconoBeneficio}>school</i>
                                <h5>Torta gratis Duoc</h5>
                                <p className="texto-secundario">Estudiantes Duoc UC reciben una torta gratis el día de su cumpleaños, con correo institucional.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section>
                <div className="container">
                    <h2 className="section-title">Explora nuestras categorías</h2>
                    <p className="section-kicker">Desde tortas especiales hasta opciones sin azúcar, sin gluten y veganas.</p>
                    <div className="row" id="grid-categorias"></div>
                    <div className="text-center">
                        <Link to="/Catalogo" className="btn btn-lg btn-primary">Ver todo el catálogo</Link>
                    </div>
                </div>
            </section>

            <section className="alt">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-7">
                            <h2 className="section-title">Impacto comunitario</h2>
                            <p className="texto-secundario">
                                Cada compra apoya la formación de nuevos talentos en gastronomía:
                                trabajamos junto a estudiantes de Duoc UC para mantener viva la
                                tradición repostera chilena y abrir oportunidades reales en el rubro.
                            </p>
                            <a href="#" className="btn btn-rosa">Conoce nuestra comunidad</a>
                        </div>
                        <div className="col-12 col-md-5 text-center d-none d-md-block">
                            <i className={"material-icons " + styles.iconoComunidad}>volunteer_activism</i>
                        </div>
                    </div>
                </div>
            </section>


            <Footer completo/>
        </>
    );

}

export default Inicio
