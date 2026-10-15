import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {

  // Prueba 9 (props por defecto): sin "completo" solo muestra el copyright con el año actual
  it('por defecto muestra solo el copyright con el año actual', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);

    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
    expect(screen.queryByText('Navegación')).not.toBeInTheDocument();
  });

  // Prueba 10 (props): con la prop "completo" muestra las columnas de información
  it('con la prop completo muestra las columnas de información', () => {
    render(<MemoryRouter><Footer completo /></MemoryRouter>);

    expect(screen.getByText('Navegación')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText(/Proyecto académico Duoc UC/)).toBeInTheDocument();
  });
});
