<<<<<<< HEAD

=======
>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
import { render, screen, fireEvent } from '@testing-library/react';
import Formulario from './formulario';


const campos = [
  { id: 'nombre', label: 'Nombre' },
  { id: 'email', label: 'Correo electrónico', type: 'email' },
];

describe('Formulario', () => {


  it('muestra los campos y el botón que recibe por props', () => {
    render(<Formulario campos={campos} textoBoton="Enviar" onGuardar={() => {}} />);

    expect(screen.getByLabelText('Nombre')).toBeTruthy();
    expect(screen.getByLabelText('Correo electrónico')).toBeTruthy();
    expect(screen.getByText('Enviar')).toBeTruthy();
  });

<<<<<<< HEAD

=======
  
>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
  it('entrega los valores escritos a onGuardar al hacer clic en el botón', () => {
    const onGuardar = jasmine.createSpy('onGuardar');
    render(<Formulario campos={campos} textoBoton="Enviar" onGuardar={onGuardar} />);

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@test.cl' } });
    fireEvent.click(screen.getByText('Enviar'));

    expect(onGuardar).toHaveBeenCalledTimes(1);
    expect(onGuardar.calls.mostRecent().args[0]).toEqual({ nombre: 'Ana', email: 'ana@test.cl' });
  });

<<<<<<< HEAD

=======
  
>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
  it('muestra la alerta solo cuando la validación falla', () => {
    function validar(valores, alerta) {
      if (valores.nombre.trim().length == 0) {
        alerta('El nombre no debe de estar vacío.');
      }
    }

    render(<Formulario campos={campos} textoBoton="Enviar" onGuardar={validar} />);


    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.click(screen.getByText('Enviar'));

    expect(screen.getByRole('alert').textContent).toContain('El nombre no debe de estar vacío.');
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 98150b63559c62e74fc4a86962ffa6bbb1586d8b
