/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
//import { BrowserRouter } from 'react-router-dom'; // Eliminar la importación
import Menu from '../pages/Menu';

// Mockear localStorage
const localStorageMock = (function() {
  let store = {};

  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = String(value);
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mockear fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: 1, name: 'Dish 1', description: 'Desc 1', price: 10, category: 'tradicionales', image: '/img1.jpg' },
      { id: 2, name: 'Dish 2', description: 'Desc 2', price: 20, category: 'postres', image: '/img2.jpg' },
      { id: 3, name: 'Dish 3', description: 'Desc 3', price: 30, category: 'bebidas', image: '/img3.jpg' }
    ]),
  })
);

describe('Menu Component', () => {
  it('renders the menu items', async () => {
    const mockNavigate = jest.fn(); // Crear un mock de navigate

    render(
      <Menu navigate={mockNavigate} /> // Pasar el mock como prop
    );

    // Add your assertions here to check if the menu items are rendered correctly
    const dish1Name = await screen.findByText('Dish 1');
    expect(dish1Name).toBeInTheDocument();
  });

  it('navigates to /profile if user is not logged in when clicking "Agregar al carrito"', async () => {
    // Limpiar localStorage para simular que el usuario no está logueado
    localStorage.clear();

    const mockNavigate = jest.fn(); // Crear un mock de navigate

    render(
      <Menu navigate={mockNavigate} /> // Pasar el mock como prop
    );

    const addToCartButton = screen.getByTestId('add-to-cart-button-1');
    fireEvent.click(addToCartButton);

    // Esperar un tiempo suficiente para que el setTimeout se ejecute
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    }, {timeout: 500}); // Aumentar el timeout si es necesario
  });
});
