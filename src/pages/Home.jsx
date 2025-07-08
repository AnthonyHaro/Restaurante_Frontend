import React from 'react';
import { Link } from 'react-router-dom';

import cariucho from '../assets/cariucho.jpg';
import colada from '../assets/colada_morada.jpg';
import pristiños from '../assets/pristiños.jpg';

function Home() {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-amber-700 drop-shadow-sm">
          ¡Ordena ya de nuestro delicioso menú!
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Disfruta de una experiencia gastronómica única con nuestros platillos frescos y sabrosos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link
            to="/menu#tradicionales"
            className="group block transform transition hover:-translate-y-1"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl">
              <img
                src={cariucho}
                alt="Platos tradicionales"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-5">
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                  Platos tradicionales
                </h2>
                <p className="text-gray-600 text-sm">
                  Sabores auténticos que nos conectan con nuestras raíces y con el calor del hogar.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/menu#postres"
            className="group block transform transition hover:-translate-y-1"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl">
              <img
                src={pristiños}
                alt="Postres"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-5">
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                  Postres
                </h2>
                <p className="text-gray-600 text-sm">
                  Dulces caseros que despiertan recuerdos y endulzan cada momento.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/menu#bebidas"
            className="group block transform transition hover:-translate-y-1"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl">
              <img
                src={colada}
                alt="Bebidas"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-5">
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                  Bebidas
                </h2>
                <p className="text-gray-600 text-sm">
                  Refresca el alma con nuestras bebidas tradicionales, llenas de historia y sabor.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Horarios de Atención</h3>
          <p className="text-gray-700">
            Sábados y Domingos: 10:50 AM a 5:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
