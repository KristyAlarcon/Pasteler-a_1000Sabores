import { useNavigate } from "react-router-dom"


function App() {
  const navigate = useNavigate();

  function irACarrito(){
    navigate('/Carrito');
  }

  return (
    
    <div className="container center-align">
      <img src="/img/logo.png" alt="Logo Mil Sabores" style={{ height: '120px' }} />
      <h1>Mil Sabores</h1>
      <button className="btn waves-effect" onClick={irACarrito}>
        <i className="material-icons left">cake</i>Carrito
      </button>
    </div>
  )
}

export default App