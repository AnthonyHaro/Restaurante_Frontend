import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function OrdersTable({ currentUser  }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const isAdmin = currentUser .email === 'admin@gmail.com';

  useEffect(() => {
    fetch('https://backend-restaurante-g8jr.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => {
        const userOrders = isAdmin ? data : data.filter(o => o.email === currentUser .email);
        const numberedOrders = userOrders.map((order, index) => ({ ...order, displayId: index + 1 }));
        setOrders(numberedOrders);
      })
      .catch(err => console.error('Error cargando pedidos:', err))
      .finally(() => setLoading(false));
  }, [currentUser , isAdmin]);

  const handleStatusSelect = (id, newStatus) => {
    setPendingStatusChange({ id, newStatus });
  };

  const confirmStatusChange = () => {
    if (!pendingStatusChange) return;
    const { id, newStatus } = pendingStatusChange;
    fetch(`https://backend-restaurante-g8jr.onrender.com/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        setOrders(prev =>
          prev.map(order => order.id === id ? { ...order, status: newStatus } : order)
        );
      })
      .catch(err => console.error('Error actualizando estado:', err))
      .finally(() => setPendingStatusChange(null));
  };

  const cancelStatusChange = () => {
    setPendingStatusChange(null);
  };

  if (loading) return <p>Cargando pedidos...</p>;
  if (orders.length === 0) return <p className="text-center py-6 text-gray-500 italic">No hay pedidos para mostrar.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl overflow-hidden text-sm">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Cliente</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{order.displayId}</td>
                <td className="py-3 px-4">{order.email}</td>
                <td className="py-3 px-4">{new Date(order.date).toLocaleString()}</td>
                <td className="py-3 px-4">
                  {isAdmin ? (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusSelect(order.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  ) : (
                    order.status
                  )}
                </td>
                <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FaSearch className="text-sm" />
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-bounce-in">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Detalles del Pedido #{selectedOrder.displayId}
            </h3>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800">Dirección de Entrega:</h4>
              <p className="text-gray-600">{selectedOrder.address || 'No proporcionada'}</p>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold text-gray-800">Contacto:</h4>
              <p className="text-gray-600">{selectedOrder.contact || 'No proporcionado'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 ">Platos</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ul className="divide-y">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="py-2 flex justify-between items-center">
                      <span className="font-medium text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Este pedido no tiene detalles.</p>
              )}
            </div>
            <div className="text-right font-semibold text-lg mt-4">
              Total: <span className="text-green-600">${selectedOrder.total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>
      )}


      {pendingStatusChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-bounce-in">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl text-center">
            <h3 className="text-xl font-semibold mb-4">¿Confirmar cambio de estado?</h3>
            <p className="text-gray-700 mb-6">
              Estás por cambiar el estado del pedido <strong>#{orders.find(o => o.id === pendingStatusChange.id)?.displayId}</strong> a <strong>{pendingStatusChange.newStatus}</strong>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmStatusChange}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                onClick={cancelStatusChange}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersTable;
