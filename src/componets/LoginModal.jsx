import { useState } from 'react';
import axios from 'axios';

function LoginModal({ onClose, onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (formData.email === adminEmail && formData.password === adminPassword) {
      const adminUser = {
        name: 'admin1',
        email: adminEmail,
        address: 'Francisco Guarderas 806, Sangolquí',
        role: 'admin',
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      setSuccessMsg('Inicio de sesión exitoso como administrador');
      onLoginSuccess();
      return;
    }

    try {
      const response = await axios.post('https://backend-restaurante-g8jr.onrender.com/api/login', formData);
      const user = response.data.user || response.data;
      user.role = 'client';
      localStorage.setItem('user', JSON.stringify(user));
      setSuccessMsg('¡Inicio de sesión exitoso!');
      setFormData({ email: '', password: '' });
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur- animate-bounce-in">
      <div className="relative bg-white w-full max-w-md mx-4 sm:mx-auto p-6 rounded-xl shadow-lg border border-gray-200 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
          Disfruta de deliciosas comidas ingresando a tu cuenta
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} 
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword ? '🙈' : '👁️'} 
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          ¿No tienes cuenta?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={onSwitchToRegister}
          >
            Únete ahora
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
