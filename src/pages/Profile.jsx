import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import LoginModal from '../componets/LoginModal';
import RegisterModal from '../componets/RegisterModal';
import ChangePasswordModal from '../componets/ChangePasswordModal';
import ClientsTable from '../componets/ClientsTable';
import OrdersTable from '../componets/OrdersTable';

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeSection, setActiveSection] = useState('info');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Para controlar visibilidad del mensaje de bienvenida
  const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(false);

  const isAdmin = userData?.email === 'admin@gmail.com';
  const isTest = process.env.NODE_ENV === 'test';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
        setIsLoggedIn(true);
        setWelcomeMessageVisible(true); 
      } catch (err) {
        console.error('Error al analizar user del localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (welcomeMessageVisible) {
      const timer = setTimeout(() => setWelcomeMessageVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessageVisible]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setActiveSection('info');
  };

  const fetchUsers = async () => {
    if (isTest) return;
    setLoading(true);
    try {
      const res = await fetch('https://backend-restaurante-g8jr.onrender.com/api/users');
      const users = await res.json();
      setUsersList(users.filter(u => u.email !== 'admin@gmail.com'));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email) => {
    if (isTest) return;
    try {
      setUsersList(prevUsers => prevUsers.filter(user => user.email !== email));

      const res = await fetch(`https://backend-restaurante-g8jr.onrender.com/api/users/${email}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  useEffect(() => {
    if (isAdmin && activeSection === 'clients') {
      fetchUsers();
    }
  }, [activeSection, isAdmin]);

  const isModalOpen = showLogin || showRegister || showChangePassword;

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Mensaje de bienvenida fijo arriba */}
      {isLoggedIn && welcomeMessageVisible && (
        <div
          className="
            fixed top-6 left-1/2 transform -translate-x-1/2 
            bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg 
            text-lg font-semibold z-50
            opacity-100 translate-y-0
            transition-all duration-700 ease-in-out
          "
          style={{  
            opacity: welcomeMessageVisible ? 1 : 0,
            transform: welcomeMessageVisible ? 'translate(-50%, 0)' : 'translate(-50%, -20px)',
          }}
        >
          Bienvenido {isAdmin ? 'Administrador' : 'Cliente'} <span className="capitalize">{userData.name}</span>!
        </div>
      )}

      <div className={`p-6 transition duration-300 ${isModalOpen ? 'blur-sm brightness-50 pointer-events-none' : ''}`}>
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
            <FaUserCircle className="text-7xl text-gray-500 mb-4" />
            <p className="text-xl mb-4">¡Inicia sesión para saborear lo mejor de nuestra cocina!</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded" onClick={() => setShowLogin(true)}>
              Ingresar
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 bg-white p-4 rounded-xl shadow-md">
              <ul className="space-y-4">
                <li
                  className={`cursor-pointer text-lg ${activeSection === 'info' ? 'text-amber-700 font-semibold' : ''}`}
                  onClick={() => setActiveSection('info')}
                >
                  Información General
                </li>
                <li
                  className={`cursor-pointer text-lg ${activeSection === 'orders' ? 'text-amber-700 font-semibold' : ''}`}
                  onClick={() => setActiveSection('orders')}
                >
                  Pedidos
                </li>
                {isAdmin && (
                  <li
                    className={`cursor-pointer text-lg ${activeSection === 'clients' ? 'text-amber-700 font-semibold' : ''}`}
                    onClick={() => setActiveSection('clients')}
                  >
                    Clientes
                  </li>
                )}
              </ul>
            </div>
            <div className="w-full lg:w-3/4 bg-white p-6 rounded-xl shadow-md min-h-[400px]">
              {activeSection === 'info' && (
                <div className="space-y-6 ">
                  <h2 className="text-3xl font-bold text-gray-700 text-center">Información del Usuario</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                      <p className="text-sm font-medium text-gray-500">Nombre</p>
                      <p className="text-lg font-semibold">{userData.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                      <p className="text-sm font-medium text-gray-500">Correo</p>
                      <p className="text-lg font-semibold">{userData.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="text-lg font-semibold">{userData.address}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                      <p className="text-sm font-medium text-gray-500">Contacto</p>
                      <p className="text-lg font-semibold">{userData.contact || 'No proporcionado'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                      <p className="text-sm font-medium text-gray-500">Cedula</p>
                      <p className="text-lg font-semibold">{userData.cedula || 'No proporcionado'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6 flex justify-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
                      onClick={() => setShowChangePassword(true)}
                    >
                      Cambiar contraseña
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'clients' && isAdmin && (
                loading ? (
                  <p>Cargando clientes...</p>
                ) : (
                  <ClientsTable users={usersList} onDeleteUser={handleDeleteUser} />
                )
              )}

              {activeSection === 'orders' && (
                <OrdersTable currentUser={userData} />
              )}
            </div>
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUserData(JSON.parse(storedUser));
              setIsLoggedIn(true);
              setWelcomeMessageVisible(true); 
            }
            setShowLogin(false);
          }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowLogin(true);
            setShowRegister(false);
          }}
        />

      )}

      {showChangePassword && userData && (
        <ChangePasswordModal
          userEmail={userData.email}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
}

export default Profile;
