import { useState } from 'react';
import axios from 'axios';
import { verificarCedula } from 'udv-ec';

function RegisterModal({ onClose, onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    contact: '',
    cedula: '',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTest = process.env.NODE_ENV === 'test';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]{4,}@(gmail\.com|hotmail\.com|outlook\.com)$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const { name, email, address, password, contact, cedula } = formData;

      if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name.trim())) {
        setError('El nombre solo puede contener letras y espacios.');
        setIsSubmitting(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError('El correo debe tener al menos 4 caracteres antes del @ y ser gmail, hotmail u outlook.');
        setIsSubmitting(false);
        return;
      }

      if (contact.length < 10) {
        setError('El contacto debe tener al menos 10 dígitos.');
        setIsSubmitting(false);
        return;
      }

      if (!verificarCedula(cedula)) {
        setError('La cédula ingresada no es válida.');
        setIsSubmitting(false);
        return;
      }

      let users = [];
      if (!isTest) {
        const response = await axios.get('https://backend-restaurante-g8jr.onrender.com/api/users');
        users = response.data;
      }

      if (users.find((u) => u.email === email)) {
        setError('El correo ya está registrado.');
        setIsSubmitting(false);
        return;
      }

      if (users.find((u) => u.cedula === cedula)) {
        setError('La cédula ya está registrada.');
        setIsSubmitting(false);
        return;
      }

      if (!isTest) {
        await axios.post('https://backend-restaurante-g8jr.onrender.com/api/register', formData);
      }

      setSuccessMsg('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setFormData({ name: '', email: '', address: '', password: '', contact: '', cedula: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
      <div className="relative bg-white w-full max-w-md mx-4 sm:mx-auto p-6 rounded-xl shadow-lg border border-gray-200 animate-fadeIn">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-600">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Registro</h2>
        <form onSubmit={handleRegister} className="space-y-4" data-testid="register-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="tel"
            name="contact"
            placeholder="Número de contacto"
            value={formData.contact}
            onChange={handleChange}
            required
            pattern="\d{10,}"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brown-500"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMsg && (
            <div className="fixed z-50 absolute inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-lg border max-w-sm text-center animate-fadeIn">
                <h3 className="text-xl font-bold text-green-700 mb-2">¡Registro exitoso!</h3>
                <p className="text-gray-700 mb-4">{successMsg}</p>
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      onSwitchToLogin();
                    }, 300);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          ¿Ya tienes cuenta?{' '}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={onSwitchToLogin}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
