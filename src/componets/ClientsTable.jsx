import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../componets/ConfirmModal';

function ClientsTable({ users, onDeleteUser }) {
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const requestDelete = (email) => {
    setEmailToDelete(email);
  };

  const confirmDelete = () => {
    onDeleteUser(emailToDelete);
    setEmailToDelete(null);
  };

  const cancelDelete = () => {
    setEmailToDelete(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-black-700">
        Clientes Registrados
      </h2>

      {/* Buscador */}
      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl overflow-hidden text-sm">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-left">Dirección</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.email} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.address}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => requestDelete(user.email)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition inline-flex items-center gap-1"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {emailToDelete && (
        <ConfirmModal
          message="¿Estás seguro que deseas eliminar este usuario?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

ClientsTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};

export default ClientsTable;
