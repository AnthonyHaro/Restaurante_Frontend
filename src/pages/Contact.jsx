import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-center bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Contáctanos</h1>
      <p className="text-gray-600 mb-8">
        ¿Nos necesitas? Visítanos en nuestra ubicación o contáctanos por teléfono. Estaremos encantados de ayudarte.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Teléfonos</h2>
      <ul className="space-y-3 mb-8">
        <li className="flex items-center justify-center gap-3 text-lg text-green-600 hover:underline">
          <FaWhatsapp className="text-xl" />
          <a
            href="https://wa.me/593987511691"
            target="_blank"
            rel="noopener noreferrer"
          >
            +593 98 751 1691
          </a>
        </li>
        <li className="flex items-center justify-center gap-3 text-lg text-green-600 hover:underline">
          <FaWhatsapp className="text-xl" />
          <a
            href="https://wa.me/593998477733"
            target="_blank"
            rel="noopener noreferrer"
          >
            +593 99 847 7733
          </a>
        </li>
      </ul>
      <div className="bg-gray-100 p-4 rounded-lg ">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Horarios de Atención</h3>
        <p className="text-gray-700">Sábados y Domingos: 10:50 AM a 5:00 PM</p>
      </div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ubicación</h2>
      <p className="text-gray-600 mb-4">Francisco Guarderas 806, Sangolquí</p>

      <div className="rounded-lg overflow-hidden shadow-lg mb-6">
        <iframe
          title="Ubicación del restaurante"
          src="https://www.google.com/maps?q=Francisco+Guarderas+806,+Sangolquí&output=embed"
          width="100%"
          height="300"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
