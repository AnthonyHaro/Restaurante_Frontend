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
    let value = e.target.value;
    if (value.length > 30) {
      value = value.slice(0, 30);
    }
    const cleaned = value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g, '');
    setFormData({ ...formData, name: cleaned });
  };

  const handleDescriptionChange = (e) => {
    let value = e.target.value;
    if (value.length > 150) {
      value = value.slice(0, 150);
    }
    const cleaned = value.replace(/[^a-zA-Z0-9.,;:()¡!¿?%° \náéíóúÁÉÍÓÚñÑ]/g, '');
    setFormData({ ...formData, description: cleaned });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData({ ...formData, image: null });
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido.');
      setFormData({ ...formData, image: null });
      return;
    }
    setError('');
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Por favor, ingresa un precio válido mayor a cero.');
      return;
    }
    if (!formData.image) {
      setError('La imagen es obligatoria.');
      return;
    }

    setError('');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative border border-gray-300 animate-fadeIn">
        <button
          className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-600"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Añadir nuevo plato</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="name">Nombre:</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              maxLength={50}
              onChange={handleNameChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-brown-400"
              placeholder="Nombre del plato (máx 50 caracteres)"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              value={formData.description}
              maxLength={200}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-brown-400"
              placeholder="Descripción (máx 200 caracteres)"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="price">Precio:</label>
            <input
              id="price"
              type="number"
              min="0.25"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-brown-400"
              placeholder="Precio en USD"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="image">Imagen:</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
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
