import React, { useState, useRef } from 'react';
import './CardUsuario-Juego.css';
import { useNavigate } from 'react-router-dom';

const JuegoCard = ({ juego }) => {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();

  let datosExtra = {};
  try {
    datosExtra = JSON.parse(juego.datos_extra_juego || '{}');
  } catch (err) {
    console.error('Error al parsear datos_extra_juego:', err);
  }

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setMostrarInfo(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setMostrarInfo(false);
  };

  const handleClick = () => {
    const nombreFormateado = juego.nombre_juego.replaceAll(' ', '_');
    navigate(`/juegos/${nombreFormateado}`);
  };

  return (
    <div
      className={`juego-card ${mostrarInfo ? 'expandido' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img
        src={juego.foto_juego}
        alt={`Imagen de ${juego.nombre_juego}`}
        className="juego-img"
        referrerPolicy="no-referrer"
        
      />
      <div className="juego-info">
        <h4 className="game-tag">{juego.game_tag}</h4>
        {datosExtra.rango && <p className="rango">Rango: {datosExtra.rango}</p>}
        <p className={`info-extra ${mostrarInfo ? 'visible' : ''}`}>
          {datosExtra.info_extra || ''}
        </p>
      </div>
    </div>
  );
};

export default JuegoCard;
