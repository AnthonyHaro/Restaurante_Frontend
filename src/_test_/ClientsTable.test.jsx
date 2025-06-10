import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientsTable from '../componets/ClientsTable';
import '@testing-library/jest-dom';

describe('ClientsTable Component', () => {
  const mockUsers = [
    { name: 'Juan', email: 'juan@gmail.com', address: 'Calle A' },
    { name: 'Lucía', email: 'lucia@gmail.com', address: 'Calle B' },
  ];
  const mockOnDeleteUser = jest.fn();

  it('renders the table with users data', () => {
    render(<ClientsTable users={mockUsers} onDeleteUser={mockOnDeleteUser} />);

    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('juan@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Lucía')).toBeInTheDocument();
    expect(screen.getByText('lucia@gmail.com')).toBeInTheDocument();
  });

  it('calls onDeleteUser when delete button is clicked and confirmed', async () => {
    render(<ClientsTable users={mockUsers} onDeleteUser={mockOnDeleteUser} />);

    // 1. Click en el botón "Eliminar"
    fireEvent.click(screen.getAllByText('🗑️ Eliminar')[0]);

    // 2. Esperar a que aparezca el modal de confirmación
    await waitFor(() => {
      expect(screen.getByText('¿Estás seguro que deseas eliminar este usuario?')).toBeInTheDocument();
    });

    // 3. Click en el botón "Confirmar" del modal
    fireEvent.click(screen.getByText('Confirmar'));

    // 4. Esperar a que se llame a la función mockOnDeleteUser
    await waitFor(() => {
      expect(mockOnDeleteUser).toHaveBeenCalledWith('juan@gmail.com');
    });
  });

  it('displays "No hay clientes registrados" when no users are provided', () => {
    render(<ClientsTable users={[]} onDeleteUser={mockOnDeleteUser} />);

    expect(screen.getByText('No hay clientes registrados.')).toBeInTheDocument();
  });
});
