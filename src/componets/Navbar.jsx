import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaUser } from 'react-icons/fa';
import logo from '../assets/Logo2.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md top-0 left-0 right-0 z-50 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            <img src={logo} alt="El Rincón de Mamita Rosa" className="h-21 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6">
              <Link to="/menu" className="text-gray-600 hover:text-black font-bold">Menú</Link>
              <Link to="/contact" className="text-gray-600 hover:text-black font-bold">Contactos</Link>
              <Link to="/about" className="text-gray-600 hover:text-black font-bold">Nosotros</Link>
              <Link to="/carta" className="text-gray-600 hover:text-black font-bold">
                <FaShoppingCart className="text-lg" />
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-black">
                <FaUser className="text-lg" />
              </Link>
            </div>
            <button onClick={toggleMenu} className="md:hidden text-xl text-gray-700">
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <Link to="/menu" className="block py-2 text-gray-700 font-bold">Menú</Link>
          <Link to="/contact" className="block py-2 text-gray-700 font-bold">Contactos</Link>
          <Link to="/about" className="block py-2 text-gray-700 font-bold">Nosotros</Link>
          <Link to="/carta" className="block py-2 text-gray-700 font-bold">Carrito</Link>
          <Link to="/profile" className="block py-2 text-gray-700 font-bold">Perfil</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
