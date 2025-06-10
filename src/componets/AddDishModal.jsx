import React, { useState } from 'react';

const AddDishModal = ({ category, onClose, onDishAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g, '');
    setFormData({ ...formData, name: cleaned });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^a-zA-Z0-9.,;:()¡!¿?%° \náéíóúÁÉÍÓÚñÑ]/g, '');
    setFormData({ ...formData, description: cleaned });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const dishData = new FormData();
    dishData.append('name', formData.name);
    dishData.append('description', formData.description);
    dishData.append('price', formData.price);
    dishData.append('category', category);
    dishData.append('image', formData.image);

    try {
      const res = await fetch('https://backend-restaurante-g8jr.onrender.com/api/dishes', {
        method: 'POST',
        body: dishData,
      });

      if (res.ok) {
        onDishAdded();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Error al añadir el plato.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative border-2 border-black-600 animate-fadeIn" >
        <button
          className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Añadir nuevo plato</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-gray-700 mb-1">Nombre:</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-brown-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Descripción:</label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-brown-400"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Precio:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-brown-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Añadir Plato
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDishModal;
