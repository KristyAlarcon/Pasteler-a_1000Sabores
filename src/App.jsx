import { useNavigate } from "react-router-dom"


function App() {
  const navigate = useNavigate();

  function irACarrito(){
    navigate('/Carrito');
  }

  return (
    
    <div className="container text-center">
      <img src="/img/logo.png" alt="Logo Mil Sabores" style={{ height: '120px' }} />
      <h1>Mil Sabores</h1>
      <button className="btn btn-primary" onClick={irACarrito}>
        <i className="material-icons">cake</i>Carrito
      </button>
    </div>
  )
}

export default App