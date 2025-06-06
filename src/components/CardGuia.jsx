import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardGuia.css';

function formatearNombreCampeon(nombre) {
  if (!nombre) return '';

  if (nombre.toLowerCase().includes('dr. mundo') || nombre.toLowerCase().includes('dr mundo')) {
    return 'DrMundo';
  }

  if (nombre.toLowerCase().includes("kha'zix")) {
    return 'KhaZix';
  }

  let limpio = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');

  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

const CardGuia = ({ guia }) => {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const hoverTimeout = useRef(null);

  const contenido = JSON.parse(guia.contenido_guia);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowDescription(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setShowDescription(false);
  };

  const handleClick = () => {
    navigate(`/guias/${guia.id_guia}`);
  };

  return (
    <div
      className={`card-guia ${showDescription ? 'expandido' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formatearNombreCampeon(contenido.campeon)}_0.jpg`}
        alt={`Imagen de ${contenido.campeon}`}
        className="imagen-guia"
        referrerPolicy="no-referrer"
      />
      <div className="info-guia">
        <h3 className="nombre-guia">{contenido.titulo}</h3>
        <p className="campeon-guia">Creador: {guia.nombre_usuario}</p>
        <p className={`descripcion-guia ${showDescription ? 'visible' : ''}`}>
          {contenido.descripcion}
        </p>
      </div>
    </div>
  );
};

export default CardGuia;
