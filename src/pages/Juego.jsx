import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Juego.css';
import { getDatosJuego } from '../peticiones/juego_peticiones.mjs';
import { useParams } from 'react-router-dom';

const GameProfilePage = () => {
  const { juegoId } = useParams();
  const [juego, setJuego] = useState(null);

  useEffect(() => {
    const fetchJuego = async () => {
      const data = await getDatosJuego(juegoId);
      setJuego(data);
    };
    fetchJuego();
  }, [juegoId]);

  if (!juego) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '120px 20px', color: '#f5f5f5' }}>
          <h2>Cargando información del juego...</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="game-profile">
        <div className="header">
          <img
            src={juego.banner}
            alt={`${juego.nombre} Banner`}
            className="header-image"
          />
        </div>

        <div className="profile-info">
          <img
            src={juego.foto_juego}
            alt={`${juego.nombre} Logo`}
            className="profile-avatar"
          />
          <h1 className="game-name">{juego.nombre}</h1>
          <p className="game-description">{juego.descripcion}</p>

          <div className="extra-info">
            <p><strong>Género:</strong> {juego.categoria}</p>
            <p><strong>Disponible en:</strong> {juego.dispositivos}</p>
            <p><strong>Rangos:</strong> {juego.rangos.join(', ')}</p>
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
