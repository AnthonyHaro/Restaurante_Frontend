import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../src/pages/Home";
import Menu from "../src/pages/Menu";
import Carta from "../src/pages/Carta";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Profile from "../src/pages/Profile";
import Navbar from './componets/Navbar';
import Footer from './componets/Footer';
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;


