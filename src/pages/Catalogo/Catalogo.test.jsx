import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Catalogo from './Catalogo';

// Catalogo usa Link y useNavigate (en la Navbar), por eso va dentro de un Router
function renderizarCatalogo() {
  return render(<MemoryRouter><Catalogo /></MemoryRouter>);
}

// Nombres de los productos que se ven en pantalla, en orden
function nombresVisibles(container) {
  return Array.from(container.querySelectorAll('#grid-productos .card p:first-of-type'))
    .map((p) => p.textContent);
}

describe('Catalogo', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // Prueba 4 (renderizado de lista): muestra una tarjeta por cada producto del catálogo
  it('muestra los 16 productos del catálogo', () => {
    const { container } = renderizarCatalogo();

    expect(container.querySelectorAll('#grid-productos .card')).toHaveLength(16);
    expect(screen.getByText('16 producto(s) encontrado(s).')).toBeInTheDocument();
  });

  // Prueba 5 (estado y evento): al elegir una categoría, solo quedan los productos de esa categoría
  it('filtra los productos por categoría', () => {
    const { container } = renderizarCatalogo();

    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Productos Vegana' } });

    expect(container.querySelectorAll('#grid-productos .card')).toHaveLength(2);
    expect(nombresVisibles(container)).toEqual(['Torta Vegana de Chocolate', 'Galletas Veganas de Avena']);
  });

  // Prueba 6 (lógica): ordena los productos por precio de menor a mayor y de mayor a menor
  it('ordena los productos por precio', () => {
    const { container } = renderizarCatalogo();
    const ordenar = screen.getByLabelText('Ordenar por');

    fireEvent.change(ordenar, { target: { value: 'menor-precio' } });
    expect(nombresVisibles(container)[0]).toBe('Empanada de Manzana');

    fireEvent.change(ordenar, { target: { value: 'mayor-precio' } });
    expect(nombresVisibles(container)[0]).toBe('Torta Especial de Boda');
  });
});
