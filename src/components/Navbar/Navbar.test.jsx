import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

function renderizarNavbar() {
  return render(<MemoryRouter><Navbar /></MemoryRouter>);
}

describe('Navbar', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Prueba 7 (renderizado condicional): sin sesión muestra los enlaces de login y registro,
  // y el contador suma las cantidades del carrito guardado
  it('sin sesión muestra iniciar sesión y regístrate, y cuenta el carrito', () => {
    localStorage.setItem('carrito', JSON.stringify([{ cantidad: 2 }, { cantidad: 3 }]));

    renderizarNavbar();

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
    expect(document.getElementById('carrito-badge')).toHaveTextContent('5');
  });

  // Prueba 8 (estado, evento y mock): con sesión saluda al usuario y "Cerrar sesión"
  // borra la sesión. Se espía localStorage.removeItem con vi.spyOn.
  it('con sesión saluda al usuario y cierra la sesión', () => {
    localStorage.setItem('sesion', JSON.stringify({ nombre: 'Ana' }));
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');

    renderizarNavbar();
    expect(screen.getByText('Hola, Ana')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar sesión'));

    expect(removeItem).toHaveBeenCalledWith('sesion');
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.queryByText('Hola, Ana')).not.toBeInTheDocument();
  });
});
