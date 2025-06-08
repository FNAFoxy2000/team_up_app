import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardGuia.css';
import AuthService from '../services/authService';
import { eliminarGuia } from '../peticiones/guias_peticiones.mjs';

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
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    const user = AuthService.getUserFromToken();
    if (user) {
      setUsuarioActivo(user);
    }
  }, []);

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

  const handleDelete = (e) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar esta guía? ${contenido.titulo}`);
    if (confirmed) {
      eliminarGuia(guia.id_guia, usuarioActivo.id_usuario);
      window.location.reload();
    }
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
        <h3 className="nombre-guia">{contenido.titulo}   {guia.privada === 1 && <span title="Guía privada" className="icono-privada"> 🔒</span>}</h3>
        <p className="campeon-guia">Creador: {guia.nombre_usuario}</p>
        <p className={`descripcion-guia ${showDescription ? 'visible' : ''}`}>
          {contenido.descripcion}
        </p>

        {usuarioActivo && usuarioActivo.id_usuario === guia.id_usuario && (
          <button className="borrar-btn" onClick={handleDelete}>
            Borrar guía
          </button>
        )}
      </div>
    </div>
  );
};

export default CardGuia;
