
function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <h3 className="text-xl font-bold mb-4 text-center">
          Detalles del Pedido #{order.displayId}
        </h3>
        <ul className="divide-y">
          {order.items.map((item, idx) => (
            <li key={idx} className="py-2 flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-right font-semibold mt-4">
          Total: ${order.total.toFixed(2)}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
