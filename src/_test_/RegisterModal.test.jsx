import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterModal from '../componets/RegisterModal';
import * as udvEc from 'udv-ec'; // Importa el módulo completo

describe('RegisterModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    render(<RegisterModal isOpen={true} onClose={onClose} onRegisterSuccess={jest.fn()} onSwitchToLogin={jest.fn()}/>);
  });

  test('registro exitoso simulado en test', async () => {

    jest.spyOn(udvEc, 'verificarCedula').mockReturnValue(true);

    const registerForm = screen.getByTestId('register-form');

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'juan@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Cédula'), {
      target: { value: '1717171717' }, 
    });
    fireEvent.change(screen.getByPlaceholderText('Dirección'), {
      target: { value: 'Calle 1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '0999999999' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '123456' },
    });

    fireEvent.submit(registerForm); 

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled(); 
    });
    udvEc.verificarCedula.mockRestore();
  });

  test('muestra error si contacto es inválido', async () => {
    jest.spyOn(udvEc, 'verificarCedula').mockReturnValue(false);
    const registerForm = screen.getByTestId('register-form');

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'juan@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Cédula'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText('Dirección'), {
      target: { value: 'Calle 1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '123' }, 
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '123456' },
    });

    fireEvent.submit(registerForm); 

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(
        'El contacto debe tener al menos 10 dígitos.'
      );
    });
     udvEc.verificarCedula.mockRestore();
  });
});

