import React, { useState, useRef } from 'react';
import './CardJuego.css';
import { useNavigate } from 'react-router-dom';

const CardJuego = ({ juego }) => {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowDescription(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setShowDescription(false);
  };

  const handleClick = () => {
    const nombreFormateado = juego.nombre.replaceAll(' ', '_');
    navigate(`/juegos/${nombreFormateado}`);
  };

  return (
    <div
      className={`card-juego ${showDescription ? 'expandido' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img
        src={juego.foto_juego}
        alt={`Logo de ${juego.nombre}`}
        className="imagen-juego"
      />
      <div className="info-juego">
        <h3 className="nombre-juego">{juego.nombre}</h3>
        <p className="categoria-juego">{juego.categoria}</p>
        <p className={`descripcion-juego ${showDescription ? 'visible' : ''}`}>
          {juego.descripcion}
        </p>
      </div>
    </div>
  );
};

export default CardJuego;
