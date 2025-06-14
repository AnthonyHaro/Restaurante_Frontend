import React from 'react';
import cariucho from '../assets/cariucho.jpg';
import colada from '../assets/colada_morada.jpg';
import pristiños from '../assets/pristiños.jpg';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          ¡Ordena ya de nuestro delicioso menú!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Disfruta de una experiencia gastronómica única con nuestros platillos frescos y sabrosos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/menu" href="#tradicionales"  className="block py-2 text-gray-700 font-bold">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={cariucho} alt="Plato 1" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-lg">Platos tradicionales</h2>
              <p className="text-gray-600">Sabores auténticos que nos conectan con nuestras raíces y con el calor del hogar.</p>
            </div>
          </div>
          </Link>
          <Link to="/menu" href="#postres"  className="block py-2 text-gray-700 font-bold">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={pristiños} alt="Plato 2" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-lg">Postres</h2>
              <p className="text-gray-600">  Dulces caseros que despiertan recuerdos y endulzan cada momento.</p>
            </div>
          </div>
          </Link>
          <Link to="/menu" className="block py-2 text-gray-700 font-bold">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={colada} alt="Plato 3" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-lg">Bebidas</h2>
              <p className="text-gray-600">  Refresca el alma con nuestras bebidas tradicionales, llenas de historia y sabor.</p>
            </div>
          </div>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2">Horarios de Atención</h3>
          <p className="text-gray-700">Sábados y Domingos: 10:50 AM a 5:00 PM</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
