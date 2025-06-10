import React, { useState } from 'react';
import LoginModal from './LoginModal';

const AddToCartModal = ({ dish, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const item = {
      dishId: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      quantity,
    };

    if (!user) {
      setPendingItem(item);
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${user.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        onAddToCart();
        onClose();
      } else {
        const data = await response.json();
        console.error('Error al agregar al carrito:', data.message);
        alert('Error al agregar al carrito: ' + data.message);
      }
    } catch (error) {
      console.error('Error al enviar al backend:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  const handleLoginSuccess = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && pendingItem) {
      try {
        const response = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/cart/${user.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pendingItem),
        });

        if (response.ok) {
          onAddToCart();
          onClose();
        } else {
          const data = await response.json();
          alert('Error al agregar al carrito: ' + data.message);
        }
      } catch (error) {
        console.error('Error al enviar al backend:', error);
        alert('Error de conexión con el servidor.');
      }

      setPendingItem(null);
      setShowLoginModal(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative animate-fadeIn">
          <button
            className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-500"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center mb-4">{dish.name}</h2>

          <img
            src={`https://backend-restaurante-g8jr.onrender.com${dish.image}`}
            alt={dish.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <p className="text-gray-700 text-sm mb-4 text-center">{dish.description}</p>

          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-gray-700">Cantidad:</span>
            <div className="flex items-center gap-4">
              <button
                onClick={decrease}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
              >
                –
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={increase}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default AddToCartModal;
