import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Juego.css';

const GameProfilePage = () => {
  return (
    <>
      <Navbar />

      <div className="game-profile">
        <div className="header">
          <img
            src="https://etgeekera.com/wp-content/uploads/2016/05/clash-royale-banner.jpg"
            alt="Clash Royale Banner"
            className="header-image"
          />
        </div>

        <div className="profile-info">
          <img
            src="https://yt3.googleusercontent.com/ytc/AIdro_m0DtuBhZUI1Mie9JUspzzqediBM76hO49vWA8hM5hwu9s=s900-c-k-c0x00ffffff-no-rj"
            alt="Clash Royale Logo"
            className="profile-avatar"
          />
          <h1 className="game-name">Clash Royale</h1>
          <p className="game-description">
            ¡Forma tu mazo, domina el campo y derrota a tus enemigos en emocionantes batallas en tiempo real!
          </p>
          <div className="extra-info">
            <p><strong>Género:</strong> Estrategia en Tiempo Real</p>
            <p><strong>Disponible en:</strong> iOS, Android</p>
            <p><strong>Fecha de Lanzamiento:</strong> Marzo 2016</p>
          </div>
          <div className="cta-buttons">
            <a href="https://clashroyale.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Página Oficial
            </a>
            <a href="https://www.youtube.com/watch?v=x-Dy9_EZsdE" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Ver Tráiler
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GameProfilePage;
