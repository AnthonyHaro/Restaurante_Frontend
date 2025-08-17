import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

function Carta() {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [envio, setEnvio] = useState(2); 
  const [modalOpen, setModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [observation, setObservation] = useState('');
  const [formError, setFormError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchCartFromServer = async () => {
    try {
      const response = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/cart/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data);

        const calculatedSubtotal = data.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setSubtotal(calculatedSubtotal);

        const ivaRate = 0.12;
        setIva(calculatedSubtotal * ivaRate);


        const userResponse = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/users/${user.email}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setAddress(userData.address);
          setContact(userData.contact);
        }
      } else {
        alert('No se pudo cargar el carrito.');
      }
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  const handleRemoveItem = async (dishId) => {
    try {
      const response = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/cart/${user.email}/${dishId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCartFromServer();
      } else {
        const error = await response.json();
        alert(`No se pudo eliminar el artículo: ${error.message}`);
      }
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  };

  const handlePay = () => {
    if (!cart.length) return alert('El carrito está vacío.');
    setModalOpen(true);
  };

  const handleSubmitOrder = async () => {
    setFormError('');

    if (!address.trim()) {
      setFormError('Por favor, ingresa una dirección válida.');
      return;
    }

    if (!/^\d{10,}$/.test(contact)) {
      setFormError('Por favor, ingresa un número de contacto válido de al menos 10 dígitos.');
      return;
    }

    try {
      const total = subtotal + iva + envio;

      const response = await fetch('https://backend-restaurante-g8jr.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          items: cart,
          total,
          address,
          contact,
          observation,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setFormError(error.message || 'Error al registrar el pedido.');
        return;
      }

      await fetch(`https://backend-restaurante-g8jr.onrender.com/api/cart/${user.email}`, {
        method: 'DELETE',
      });

      setCart([]);
      setSubtotal(0);
      setIva(0);
      setModalOpen(false);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setFormError('Ocurrió un error al procesar el pago.');
    }
  };

  useEffect(() => {
    if (user && user.email) {
      fetchCartFromServer();
    }
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-80 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Tu Carrito</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-start border-b pb-2 relative">
                <img
                  src={`https://backend-restaurante-g8jr.onrender.com${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm">Cantidad: {item.quantity}</p>
                  <p className="text-green-600 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.dishId)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0 p-1"
                  title="Quitar del carrito"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-4 rounded shadow-md h-fit">
            <h3 className="text-lg font-semibold mb-2">Finalizar compra</h3>
            <p className="text-gray-700">
              Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>
            <p className="text-gray-700">
              IVA (12%): <span className="font-bold">${iva.toFixed(2)}</span>
            </p>
            <p className="text-gray-700">
              Envío: <span className="font-bold">${envio.toFixed(2)}</span>
            </p>
            <hr className="my-2" />
            <p className="text-gray-900 text-lg">
              Total: <span className="font-bold">${(subtotal + iva + envio).toFixed(2)}</span>
            </p>
            <button
              onClick={handlePay}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              Pagar
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Información de Entrega</h2>
            <p className="text-center text-sm text-gray-500 mb-6">Por favor, confirma o actualiza la información para la entrega.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ingresa tu dirección"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto:</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  setContact(onlyNumbers);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ingresa tu contacto"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones:</label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={3}
                placeholder="Por ejemplo: sin cebolla, entregar en portería..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {formError && (
              <p className="text-red-600 text-sm font-medium mb-4 text-center">{formError}</p>
            )}

            <button
              onClick={handleSubmitOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Confirmar Pedido
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full mt-3 text-sm text-red-500 hover:text-red-600 text-center transition duration-150"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carta;
