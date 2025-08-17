import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false); 

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
      setLoading(true);
      const res = await fetch('https://backend-restaurante-g8jr.onrender.com/api/dishes');
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error('Error al cargar platos:', err);
    } finally {
      setLoading(false);
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
      setShowLoginAlert(true); 
    } else {
      setCartModalDish(dish);
    }
  };

  const isAnyModalOpen =
    showModal || editingDish || dishToDelete !== null || cartModalDish || showLoginAlert;

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div
        className={`p-6 max-w-7xl mx-auto transition-all duration-300 ${
          isAnyModalOpen ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          </div>
        ) : (
          <>
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
                        >
                          🛒 Agregar al carrito
                        </button>

                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => requestDelete(dish.id)}
                              className="text-red-600 hover:text-red-800 text-xl"
                            >
                              🗑️
                            </button>
                            <button
                              onClick={() => setEditingDish(dish)}
                              className="text-blue-600 hover:text-blue-800 text-xl"
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
          </>
        )}
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

      {/* MODAL ALERTA LOGIN */}
      {showLoginAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Inicia sesión</h3>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para añadir platos al carrito.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginAlert(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
              <a
                href="/profile"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ir a iniciar sesión
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
