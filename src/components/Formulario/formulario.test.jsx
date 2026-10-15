import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Formulario from './formulario';

// Campos de ejemplo, igual que los que le pasan las páginas (Login, Registro, Carrito)
const campos = [
  { id: 'nombre', label: 'Nombre' },
  { id: 'email', label: 'Correo electrónico', type: 'email' },
];

describe('Formulario', () => {

  // Prueba 1 (props y renderizado): dibuja un campo por cada elemento de "campos" y el botón con "textoBoton"
  it('muestra los campos y el botón que recibe por props', () => {
    render(<Formulario campos={campos} textoBoton="Enviar" onGuardar={() => {}} />);

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Enviar')).toBeInTheDocument();
  });

  // Prueba 2 (estado, evento y mock): lo que se escribe queda en el estado
  // y al hacer clic se entrega a onGuardar. onGuardar es un mock (vi.fn).
  it('entrega los valores escritos a onGuardar al hacer clic en el botón', () => {
    const onGuardar = vi.fn();
    render(<Formulario campos={campos} textoBoton="Enviar" onGuardar={onGuardar} />);

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@test.cl' } });
    fireEvent.click(screen.getByText('Enviar'));

    expect(onGuardar).toHaveBeenCalledTimes(1);
    expect(onGuardar.mock.calls[0][0]).toEqual({ nombre: 'Ana', email: 'ana@test.cl' });
  });

  // Prueba 3 (renderizado condicional): la alerta solo aparece cuando la validación falla
  it('muestra la alerta solo cuando la validación falla', () => {
    function validar(valores, alerta) {
      if (valores.nombre.trim().length == 0) {
        alerta('El nombre no debe de estar vacío.');
      }
    }

    render(<Formulario campos={campos} textoBoton="Enviar" onGuardar={validar} />);

    // Antes de enviar no hay ninguna alerta
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Enviar'));

    expect(screen.getByRole('alert')).toHaveTextContent('El nombre no debe de estar vacío.');
  });
});
