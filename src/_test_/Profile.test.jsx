import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../pages/Profile';
import '@testing-library/jest-dom';
global.fetch = jest.fn();

// eslint-disable-next-line no-undef
describe('Componente <Profile />', () => {
  // eslint-disable-next-line no-undef
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks(); 
  });

  // eslint-disable-next-line no-undef
  test('Muestra mensaje si no hay sesión iniciada', () => {
    render(<Profile />);
    // eslint-disable-next-line no-undef
    expect(screen.getByText(/¡Inicia sesión para saborear lo mejor de nuestra cocina!/i)).toBeInTheDocument();
    // eslint-disable-next-line no-undef
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  test('Muestra información del usuario si hay sesión iniciada', async () => {
    const user = {
      name: 'Carlos',
      email: 'carlos@gmail.com',
      address: 'Calle Falsa 123',
      role: 'user',
      contact: '123456789',
      cedula: '0987654321',
    };
    localStorage.setItem('user', JSON.stringify(user));

    // Mock de fetch para los pedidos del usuario (simulando que no hay pedidos)
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), 
      })
    );

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Información del Usuario/i)).toBeInTheDocument();
      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
      expect(screen.getByText(user.address)).toBeInTheDocument();
      expect(screen.getByText(user.contact)).toBeInTheDocument();
      expect(screen.getByText(user.cedula)).toBeInTheDocument();
    });
  });


  // eslint-disable-next-line no-undef
  test('Cierra sesión correctamente', () => {
    const user = { name: 'Juan', email: 'juan@gmail.com' };
    localStorage.setItem('user', JSON.stringify(user));

    render(<Profile />);

    fireEvent.click(screen.getByRole('button', { name: /Cerrar sesión/i }));

    expect(screen.getByText(/¡Inicia sesión para saborear lo mejor de nuestra cocina!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Información del Usuario/i)).not.toBeInTheDocument();
  });
});
