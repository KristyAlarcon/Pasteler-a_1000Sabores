

const productosIniciales = [
  {
    codigo: "TC001",
    categoria: "Tortas Cuadradas",
    tipo: "cuadrada",
    nombre: "Torta Cuadrada de Chocolate",
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
    precio: 45000,
    icono: "cake"
  },
  {
    codigo: "TC002",
    categoria: "Tortas Cuadradas",
    tipo: "cuadrada",
    nombre: "Torta Cuadrada de Frutas",
    descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
    precio: 50000,
    icono: "cake"
  },
  {
    codigo: "TT001",
    categoria: "Tortas Circulares",
    tipo: "circular",
    nombre: "Torta Circular de Vainilla",
    descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
    precio: 40000,
    icono: "cake"
  },
  {
    codigo: "TT002",
    categoria: "Tortas Circulares",
    tipo: "circular",
    nombre: "Torta Circular de Manjar",
    descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
    precio: 42000,
    icono: "cake"
  },
  {
    codigo: "PI001",
    categoria: "Postres Individuales",
    tipo: "individual",
    nombre: "Mousse de Chocolate",
    descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
    precio: 5000,
    icono: "icecream"
  },
  {
    codigo: "PI002",
    categoria: "Postres Individuales",
    tipo: "individual",
    nombre: "Tiramisú Clásico",
    descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
    precio: 5500,
    icono: "icecream"
  },
  {
    codigo: "PSA001",
    categoria: "Productos Sin Azúcar",
    tipo: null,
    nombre: "Torta Sin Azúcar de Naranja",
    descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
    precio: 48000,
    icono: "eco"
  },
  {
    codigo: "PSA002",
    categoria: "Productos Sin Azúcar",
    tipo: null,
    nombre: "Cheesecake Sin Azúcar",
    descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
    precio: 47000,
    icono: "eco"
  },
  {
    codigo: "PT001",
    categoria: "Pastelería Tradicional",
    tipo: null,
    nombre: "Empanada de Manzana",
    descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
    precio: 3000,
    icono: "bakery_dining"
  },
  {
    codigo: "PT002",
    categoria: "Pastelería Tradicional",
    tipo: null,
    nombre: "Tarta de Santiago",
    descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos.",
    precio: 6000,
    icono: "bakery_dining"
  },
  {
    codigo: "PG001",
    categoria: "Productos Sin Gluten",
    tipo: null,
    nombre: "Brownie Sin Gluten",
    descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
    precio: 4000,
    icono: "grain"
  },
  {
    codigo: "PG002",
    categoria: "Productos Sin Gluten",
    tipo: null,
    nombre: "Pan Sin Gluten",
    descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
    precio: 3500,
    icono: "grain"
  },
  {
    codigo: "PV001",
    categoria: "Productos Vegana",
    tipo: null,
    nombre: "Torta Vegana de Chocolate",
    descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
    precio: 50000,
    icono: "spa"
  },
  {
    codigo: "PV002",
    categoria: "Productos Vegana",
    tipo: null,
    nombre: "Galletas Veganas de Avena",
    descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
    precio: 4500,
    icono: "spa"
  },
  {
    codigo: "TE001",
    categoria: "Tortas Especiales",
    tipo: null,
    nombre: "Torta Especial de Cumpleaños",
    descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
    precio: 55000,
    icono: "celebration"
  },
  {
    codigo: "TE002",
    categoria: "Tortas Especiales",
    tipo: null,
    nombre: "Torta Especial de Boda",
    descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
    precio: 60000,
    icono: "celebration"
  }
];


export const categorias = [
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Vegana",
  "Tortas Especiales"
];


const CLAVE = "productos";

// LEER: devuelve todos los productos (la primera vez usa la lista inicial)
export function obtenerProductos() {
  const guardados = localStorage.getItem(CLAVE);
  return guardados ? JSON.parse(guardados) : productosIniciales;
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

// LEER uno: busca un producto por su código
export function buscarProductoPorCodigo(codigo) {
  return obtenerProductos().find((producto) => producto.codigo === codigo);
}

// CREAR: agrega un producto nuevo al final de la lista
export function agregarProducto(producto) {
  const productos = [...obtenerProductos(), producto];
  guardarProductos(productos);
  return productos;
}

// ACTUALIZAR: reemplaza los datos del producto con ese código
export function actualizarProducto(codigo, datos) {
  const productos = obtenerProductos().map((producto) =>
    producto.codigo === codigo ? { ...producto, ...datos, codigo } : producto
  );
  guardarProductos(productos);
  return productos;
}

// ELIMINAR: quita el producto con ese código
export function eliminarProducto(codigo) {
  const productos = obtenerProductos().filter((producto) => producto.codigo !== codigo);
  guardarProductos(productos);
  return productos;
}
