import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div>
          <h3 className="text-lg font-bold mb-2">El Rincón de Mamita Rosa</h3>
          <p>Disfruta de nuestra comida tradicional.<br />¡Ven y prueba lo mejor de la tradición casera!</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Contactos</h3>
          <p>+593 98 751 1691<br />+593 99 847 7733</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Síguenos</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://www.facebook.com/ELRINCONDEMAMITAROSA/?locale=es_LA" className="text-white hover:text-gray-300"><FaFacebook size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
