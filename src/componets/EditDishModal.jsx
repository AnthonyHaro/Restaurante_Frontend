import React, { useState } from 'react';

const EditDishModal = ({ dish, onClose, onDishUpdated }) => {
  const [formData, setFormData] = useState({
    name: dish.name,
    description: dish.description,
    price: dish.price,
    category: dish.category,
    image: null,
  });

  const [preview, setPreview] = useState(`https://backend-restaurante-g8jr.onrender.com${dish.image}`);
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

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g, '');
    setFormData({ ...formData, category: cleaned });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, category, image } = formData;

    if (!name || !description || !price || !category) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      setError('El precio debe ser un número positivo.');
      return;
    }

    const updatedData = new FormData();
    updatedData.append('name', name);
    updatedData.append('description', description);
    updatedData.append('price', price);
    updatedData.append('category', category);
    if (image) updatedData.append('image', image);

    try {
      const res = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/dishes/${dish.id}`, {
        method: 'PUT',
        body: updatedData,
      });

      if (!res.ok) throw new Error('Error al actualizar el plato.');

      onDishUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
      <div className="bg-white w-full max-w-md mx-4 sm:mx-auto p-6 rounded-xl shadow-lg border-2 border-gray-300 overflow-y-auto max-h-[90vh] relative animate-fadeIn">
        <button
          className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Editar Plato</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-gray-700 mb-1">Categoría:</label>
            <input
              type="text"
              value={formData.category}
              onChange={handleCategoryChange}
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
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full mt-2 rounded-md border"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDishModal;
