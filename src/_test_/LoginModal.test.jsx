import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginModal from '../componets/LoginModal';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios'); // Mock axios para las pruebas de llamadas a la API

describe('Componente LoginModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSwitchToRegister = jest.fn();
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renderiza el formulario de inicio de sesión correctamente', () => {
    render(
      <LoginModal
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
    expect(screen.getByText(/¿No tienes cuenta?/i)).toBeInTheDocument();
  });

  it('llama a onSwitchToRegister cuando se hace clic en "Únete ahora"', () => {
    render(
      <LoginModal
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    fireEvent.click(screen.getByText(/Únete ahora/i));
    expect(mockOnSwitchToRegister).toHaveBeenCalled();
  });

  it('muestra el mensaje de error al fallar el inicio de sesión', async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: 'Credenciales inválidas' } },
    });

    render(
      <LoginModal
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });

  it('llama a onLoginSuccess y onClose al iniciar sesión correctamente', async () => {
    const mockUser = { name: 'Usuario de prueba', email: 'test@example.com' };
    axios.post.mockResolvedValue({ data: { user: mockUser } });

    render(
      <LoginModal
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
    });
  });

  it('maneja el inicio de sesión de administrador correctamente', async () => {
    render(
      <LoginModal
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'admin@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
      expect(localStorage.getItem('user')).toEqual(
        JSON.stringify({
          name: 'admin1',
          email: 'admin@gmail.com',
          address: 'Francisco Guarderas 806, Sangolquí',
          role: 'admin',
        })
      );
    });
  });
});
