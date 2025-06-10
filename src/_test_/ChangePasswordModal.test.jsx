import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordModal from '../components/ChangePasswordModal';

global.fetch = jest.fn();

beforeEach(() => {
  localStorage.setItem('user', JSON.stringify({ email: 'prueba@gmail.com' }));
  jest.clearAllMocks();
});

test('Muestra error si campos están vacíos', () => {
  render(<ChangePasswordModal onClose={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));
  expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument();
});

test('Cambia contraseña correctamente', async () => {
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Contraseña actualizada' })
  }));

  render(<ChangePasswordModal onClose={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText(/Contraseña Actual/i), { target: { value: '1234' } });
  fireEvent.change(screen.getByPlaceholderText(/Nueva Contraseña/i), { target: { value: 'abcd' } });
  fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

  await waitFor(() => {
    expect(screen.getByText(/Contraseña actualizada/i)).toBeInTheDocument();
  });
});

test('Muestra error si la contraseña actual no coincide', async () => {
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ message: 'Contraseña incorrecta' })
  }));

  render(<ChangePasswordModal onClose={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText(/Contraseña Actual/i), { target: { value: 'wrong' } });
  fireEvent.change(screen.getByPlaceholderText(/Nueva Contraseña/i), { target: { value: 'abcd' } });
  fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

  await waitFor(() => {
    expect(screen.getByText(/Contraseña incorrecta/i)).toBeInTheDocument();
  });
});
