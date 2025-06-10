import { useState} from 'react';
import axios from 'axios';

function ChangePasswordModal({ onClose, userEmail }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const containsSpecialChars = (str) => /[^a-zA-Z0-9]/.test(str);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (containsSpecialChars(newPassword)) {
      setError('La nueva contraseña no debe tener caracteres especiales.');
      return;
    }

    try {
      const res = await axios.post('https://backend-restaurante-g8jr.onrender.com/api/change-password', {
        email: userEmail.trim().toLowerCase(),
        oldPassword,
        newPassword,
      });

      setSuccessMsg(res.data.message);
      setOldPassword('');
      setNewPassword('');

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 animate-bounce-in">
      <div className="bg-white p-6 rounded-xl shadow-xl  w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Cambiar Contraseña</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-500 text-white py-2 rounded-lg transition"
          >
            Actualizar
          </button>
        </form>

        {error && <p className="text-red-600 mt-2 text-sm text-center">{error}</p>}
        {successMsg && <p className="text-green-600 mt-2 text-sm text-center">{successMsg}</p>}
      </div>
    </div>
  );
}

export default ChangePasswordModal;
