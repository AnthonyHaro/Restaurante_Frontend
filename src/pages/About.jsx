import React, { useState, useEffect } from 'react';
import nosotros1 from '../assets/nosotro.jpg';
import nosotros2 from '../assets/nosotro2.jpg';
import nosotros3 from '../assets/nosotro3.jpg';
import nosotros4 from '../assets/nosotro4.jpg';

const images = [
  nosotros4,
  nosotros3,
  nosotros1,
  nosotros2
];

function About() {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true); 
      }, 500); 
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <img
            src={images[currentImage]}
            alt="Sobre nosotros"
            className={`w-full h-80 object-cover rounded-2xl shadow-lg transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-700 mb-6">Nosotros</h1>
          <p className="text-gray-700 mb-4 leading-relaxed">
            En <strong className="text-gray-700">El Rincón de Mamita Rosa</strong>, creemos en el valor de lo auténtico.
            Nuestro compromiso es ofrecer comida tradicional ecuatoriana preparada con ingredientes frescos,
            recetas artesanales y, sobre todo, mucho cariño.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Cada plato refleja el amor por nuestras raíces y el respeto por lo que nuestros clientes esperan:
            sabor casero, precios accesibles y porciones generosas.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Somos más que un restaurante, somos una experiencia de hogar en cada bocado.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
