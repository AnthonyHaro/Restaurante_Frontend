import { useEffect, useState } from "react";

function ClientsTable({ users, onDeleteUser }) {
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetch("https://backend-restaurante-g8jr.onrender.com/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error cargando pedidos:", err));
  }, []);

  const handleDeleteClick = (user) => {
    const userOrders = orders.filter((order) => order.email === user.email);
    if (userOrders.length > 0) {
      setError(
        `El cliente ${user.name} tiene pedidos asociados y no se puede eliminar.`
      );
      setShowErrorModal(true);
      return;
    }
    setSelectedUser(user);
    setShowConfirm(true);
    setError("");
  };

  const confirmDelete = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.email);
      setShowConfirm(false);
      setSelectedUser(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedUser(null);
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center py-6 text-gray-500 italic">
        No hay clientes registrados.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-black-700 tracking-wide">
        Clientes
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">Nombre</th>
              <th className="py-4 px-6 text-left font-semibold">Email</th>
              <th className="py-4 px-6 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.email}
                className="border-b border-gray-200 hover:bg-amber-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 font-medium text-gray-700">
                  {user.name}
                </td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal confirmación eliminación */}
      {showConfirm && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm bg-opacity-50 px-4 py-8"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
        >
          <div className="bg-white rounded-xl border border-black p-6 shadow-lg w-full max-w-sm text-center animate-fadeInUp">
            <h3
              id="confirm-title"
              className="text-2xl font-bold text-amber-700 mb-4"
            >
              ¿Eliminar cliente?
            </h3>
            <p id="confirm-desc" className="mb-6 text-gray-700">
              Estás por eliminar al cliente{" "}
              <strong>{selectedUser.name}</strong> con email{" "}
              <strong>{selectedUser.email}</strong>.
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition"
              >
                Eliminar
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal error */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm bg-opacity-50 px-4 py-8"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="error-title"
          aria-describedby="error-desc"
        >
          <div className="bg-white rounded-xl border border-red-500 p-6 shadow-lg w-full max-w-sm text-center animate-fadeInUp">
            <h3
              id="error-title"
              className="text-2xl font-bold text-red-600 mb-4"
            >
              No se puede eliminar
            </h3>
            <p id="error-desc" className="mb-6 text-gray-700">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default ClientsTable;
