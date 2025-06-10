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
    // Mockear la función verificarCedula para que siempre retorne true
    jest.spyOn(udvEc, 'verificarCedula').mockReturnValue(true);

    // Obtener el formulario ANTES de interactuar con los inputs
    const registerForm = screen.getByTestId('register-form');

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'juan@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Cédula'), {
      target: { value: '1717171717' }, // Cédula válida
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

    fireEvent.submit(registerForm); // Usar la referencia al formulario

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled(); // suponiendo que el modal se cierra al registrarse
    });

    // Restaurar la implementación original de verificarCedula (opcional, pero buena práctica)
    udvEc.verificarCedula.mockRestore();
  });

  test('muestra error si contacto es inválido', async () => {
    // Mockear la función verificarCedula para que siempre retorne true
    jest.spyOn(udvEc, 'verificarCedula').mockReturnValue(false);
    // Obtener el formulario ANTES de interactuar con los inputs
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
      target: { value: '123' }, // inválido
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '123456' },
    });

    fireEvent.submit(registerForm); // Usar la referencia al formulario

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(
        'El contacto debe tener al menos 10 dígitos.'
      );
    });
     // Restaurar la implementación original de verificarCedula (opcional, pero buena práctica)
     udvEc.verificarCedula.mockRestore();
  });
});

