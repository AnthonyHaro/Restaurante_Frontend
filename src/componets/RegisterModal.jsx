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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.name.trim())) {
        setError('El nombre solo puede contener letras y espacios.');
        setIsSubmitting(false);
        return;
      }

      if (formData.contact.length < 10) {
        setError('El contacto debe tener al menos 10 dígitos.');
        setIsSubmitting(false);
        return;
      }

      if (!verificarCedula(formData.cedula)) {
        setError('La cédula ingresada no es válida.');
        setIsSubmitting(false);
        return;
      }

      let users = [];
      if (!isTest) {
        const usersResponse = await axios.get('https://backend-restaurante-g8jr.onrender.com/api/users');
        users = usersResponse.data;
      }

      if (users.find((user) => user.email === formData.email)) {
        setError('El correo ya está registrado.');
        setIsSubmitting(false);
        return;
      }

      if (users.find((user) => user.cedula === formData.cedula)) {
        setError('La cédula ya está registrada.');
        setIsSubmitting(false);
        return;
      }

      if (!isTest) {
        await axios.post('https://backend-restaurante-g8jr.onrender.com/api/register', formData);
      }

      setSuccessMsg('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setFormData({ name: '', email: '', address: '', password: '', contact: '', cedula: '' });

      if (!isTest) {
        try {
          const loginResponse = await axios.post('https://backend-restaurante-g8jr.onrender.com/api/login', {
            email: formData.email,
            password: formData.password,
          });
          const user = loginResponse.data.user || loginResponse.data;
          localStorage.setItem('user', JSON.stringify(user));
          onRegisterSuccess();
          onClose();
        } catch (loginError) {
          console.error('Error al iniciar sesión después del registro:', loginError);
          setError('Registro exitoso, pero hubo un problema al iniciar sesión automáticamente.');
        }
      } else {
        onRegisterSuccess();
        onClose();
      }
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="tel"
            name="contact"
            placeholder="Número de contacto"
            value={formData.contact}
            onChange={handleChange}
            required
            pattern="\d{10,}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
          />
          {error && <p className="text-red-600 text-sm" data-testid="error">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
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
