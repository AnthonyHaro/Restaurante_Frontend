import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import AddDishModal from '../componets/AddDishModal';
import EditDishModal from '../componets/EditDishModal';
import ConfirmModal from '../componets/ConfirmModal';
import AddToCartModal from '../componets/AddToCartModal';

function Menu() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartModalDish, setCartModalDish] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === 'admin@gmail.com') {
        setIsAdmin(true);
      }
    }
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const res = await fetch('https://backend-restaurante-g8jr.onrender.com/api/dishes');
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error('Error al cargar platos:', err);
    }
  };

  const handleDishAdded = () => {
    loadDishes();
    setShowModal(null);
  };

  const requestDelete = (id) => setDishToDelete(id);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/dishes/${dishToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar');
      loadDishes();
      setDishToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelDelete = () => setDishToDelete(null);

  const handleAddToCart = (dishWithQuantity) => {
    setCart((prev) => [...prev, dishWithQuantity]);
  };

  const handleClickAddToCart = (dish) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setTimeout(() => {
        !isTest && navigate('/profile'); 
      }, 400);
    } else {
      setCartModalDish(dish);
    }
  };

  const isAnyModalOpen =
    showModal || editingDish || dishToDelete !== null || cartModalDish;

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* SEO */}
      <Helmet>
        <title>Menú | El Rincón de Mamita Rosa</title>
        <meta
          name="description"
          content="Explora nuestro menú de platos tradicionales, postres y bebidas típicas ecuatorianas."
        />
      </Helmet>

      <div
        className={`p-6 max-w-7xl mx-auto transition-all duration-300 ${
          isAnyModalOpen ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <div className="flex justify-center gap-6 mb-10">
          <a href="#tradicionales" className="text-green-700 font-medium hover:underline">
            Tradicionales
          </a>
          <a href="#postres" className="text-green-700 font-medium hover:underline">
            Postres
          </a>
          <a href="#bebidas" className="text-green-700 font-medium hover:underline">
            Bebidas
          </a>
        </div>

        {['tradicionales', 'postres', 'bebidas'].map((cat) => (
          <div key={cat} id={cat} className="mb-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold capitalize text-gray-800">
                {cat}
              </h2>
              {isAdmin && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => setShowModal(cat)}
                  data-testid={`add-dish-button-${cat}`} 
                >
                  ➕ Añadir Plato
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {dishes
                .filter((d) => d.category === cat)
                .map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 relative"
                  >
                    <img
                      src={`https://backend-restaurante-g8jr.onrender.com${dish.image}`}
                      alt={dish.name}
                      className="w-full h-48 object-cover rounded-xl mb-3"
                    />
                    <h3 className="text-lg font-bold text-gray-900">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                    <p className="text-green-700 font-semibold mt-2">
                      ${dish.price}
                    </p>

                    <button
                      onClick={() => handleClickAddToCart(dish)}
                      className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg"
                      data-testid={`add-to-cart-button-${dish.id}`}
                    >
                      🛒 Agregar al carrito
                    </button>

                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => requestDelete(dish.id)}
                          className="text-red-600 hover:text-red-800 text-xl"
                          data-testid={`delete-dish-button-${dish.id}`} 
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => setEditingDish(dish)}
                          className="text-blue-600 hover:text-blue-800 text-xl"
                          data-testid={`edit-dish-button-${dish.id}`} 
                        >
                          📝
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODALES */}
      {showModal && (
        <AddDishModal
          category={showModal}
          onClose={() => setShowModal(null)}
          onDishAdded={handleDishAdded}
        />
      )}

      {editingDish && (
        <EditDishModal
          dish={editingDish}
          onClose={() => setEditingDish(null)}
          onDishUpdated={loadDishes}
        />
      )}

      {dishToDelete !== null && (
        <ConfirmModal
          message="¿Estás seguro que deseas eliminar este plato?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {cartModalDish && (
        <AddToCartModal
          dish={cartModalDish}
          onClose={() => setCartModalDish(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default Menu;
