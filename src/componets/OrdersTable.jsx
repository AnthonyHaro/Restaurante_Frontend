import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function OrdersTable({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const isAdmin = currentUser.email === 'admin@gmail.com';

  useEffect(() => {
    fetch('https://backend-restaurante-g8jr.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => {
        const userOrders = isAdmin ? data : data.filter(o => o.email === currentUser.email);
        const numberedOrders = userOrders.map((order, index) => ({ ...order, displayId: index + 1 }));
        setOrders(numberedOrders);
      })
      .catch(err => console.error('Error cargando pedidos:', err))
      .finally(() => setLoading(false));
  }, [currentUser, isAdmin]);

  const handleStatusSelect = (id, newStatus, currentStatus) => {
    if (currentStatus === 'Entregado') return;
    setPendingStatusChange({ id, newStatus });
  };

  const confirmStatusChange = () => {
    if (!pendingStatusChange) return;
    const { id, newStatus } = pendingStatusChange;

    const order = orders.find(o => o.id === id);
    if (order?.status === 'Entregado') {
      alert('No se puede cambiar el estado de un pedido entregado.');
      setPendingStatusChange(null);
      return;
    }

    fetch(`https://backend-restaurante-g8jr.onrender.com/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(() => {
        setOrders(prev =>
          prev.map(order => (order.id === id ? { ...order, status: newStatus } : order))
        );
      })
      .catch(err => console.error('Error actualizando estado:', err))
      .finally(() => setPendingStatusChange(null));
  };

  const cancelStatusChange = () => {
    setPendingStatusChange(null);
  };

  if (loading) return <p className="text-center py-6 text-gray-600">Cargando pedidos...</p>;
  if (orders.length === 0)
    return (
      <p className="text-center py-6 text-gray-500 italic">
        No hay pedidos para mostrar.
      </p>
    );

  const filteredOrders = orders.filter(order => {
    const matchesName = order.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    return matchesName && matchesStatus;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-black-700 tracking-wide">
        Pedidos
      </h2>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-md mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nombre..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">ID</th>
              <th className="py-4 px-6 text-left font-semibold">Cliente</th>
              <th className="py-4 px-6 text-left font-semibold">Fecha</th>
              <th className="py-4 px-6 text-left font-semibold">Estado</th>
              <th className="py-4 px-6 text-left font-semibold">Total</th>
              <th className="py-4 px-6 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-amber-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 font-medium text-amber-700">{order.displayId}</td>
                <td className="py-3 px-6 text-gray-700 truncate max-w-xs">{order.name || order.email}</td>
                <td className="py-3 px-6 text-gray-600">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="py-3 px-6">
                  {isAdmin ? (
                    <select
                      value={order.status}
                      onChange={e => handleStatusSelect(order.id, e.target.value, order.status)}
                      className={`border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        order.status === 'Entregado' ? 'bg-gray-200 cursor-not-allowed' : ''
                      }`}
                      disabled={order.status === 'Entregado'}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Pendiente'
                          ? 'bg-yellow-200 text-yellow-800'
                          : order.status === 'Enviado'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 font-semibold text-green-600">${order.total.toFixed(2)}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold transition"
                    aria-label={`Ver detalles del pedido ${order.displayId}`}
                  >
                    <FaSearch className="text-lg" />
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl  border border-black p-6 shadow-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative animate-fadeInUp">
            <button
              onClick={() => setShowDetails(false)}
              aria-label="Cerrar detalles del pedido"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold transition"
            >
              &times;
            </button>

            <h3
              id="modal-title"
              className="text-3xl font-extrabold text-amber-700 mb-6 text-center tracking-wide"
            >
              Pedido #{selectedOrder.displayId}
            </h3>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Dirección de Entrega</h4>
              <p className="text-gray-600 break-words">
                {selectedOrder.address || 'No proporcionada'}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Contacto</h4>
              <p className="text-gray-600">{selectedOrder.contact || 'No proporcionado'}</p>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Observación</h4>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedOrder.observation || 'No se añadió ninguna observación.'}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Platos del pedido</h4>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ul className="divide-y divide-amber-200 max-h-60 overflow-y-auto rounded-md border border-amber-300">
                  {selectedOrder.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center py-3 px-4 hover:bg-amber-50 transition rounded-md"
                    >
                      <div>
                        <p className="font-semibold text-gray-700">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-amber-700">${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Este pedido no tiene detalles.</p>
              )}
            </div>
            {(() => {
              const subtotal = selectedOrder.items?.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ) || 0;

              const iva = subtotal * 0.12;
              const shippingCost = 2;
              const total = subtotal + iva + shippingCost;

              return (
                <>
                  <div className="text-right font-semibold text-gray-700 mt-4 space-y-1">
                    <p>
                      IVA (12%): <span className="text-gray-900">${iva.toFixed(2)}</span>
                    </p>
                    <p>
                      Costo de envío: <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="text-right font-extrabold text-xl text-amber-700">
                    Total: <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal confirmación cambio estado */}
      {pendingStatusChange && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm px-4 py-8"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
        >
          <div className="bg-white rounded-xl border border-black p-6 shadow-lg  shadow-xl w-full max-w-sm p-6 text-center animate-fadeInUp">
            <h3
              id="confirm-title"
              className="text-2xl font-bold text-amber-700 mb-4"
            >
              ¿Confirmar cambio de estado?
            </h3>
            <p id="confirm-desc" className="mb-6 text-gray-700">
              Estás por cambiar el estado del pedido{' '}
              <strong>
                #{orders.find(o => o.id === pendingStatusChange.id)?.displayId}
              </strong>{' '}
              a <strong>{pendingStatusChange.newStatus}</strong>.
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={confirmStatusChange}
                className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition"
              >
                Confirmar
              </button>
              <button
                onClick={cancelStatusChange}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animaciones */}
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

export default OrdersTable;
