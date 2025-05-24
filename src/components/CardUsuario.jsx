import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardUsuario.css';

const UsuarioCard = ({ usuario }) => {
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowEmail(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setShowEmail(false);
  };

  const handleClick = () => {
    navigate(`/usuario/datosUsuario?email=${encodeURIComponent(usuario.email)}`);
  };

  return (
    <div
      className={`usuario-card ${showEmail ? 'expandido' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={`Ver perfil de ${usuario.nombre_usuario_app || usuario.nombre_usuario}`}
    >
      <img
        src={usuario.avatar || '/default-avatar.png'}
        alt={`${usuario.nombre_usuario_app || usuario.nombre_usuario} avatar`}
        className="usuario-avatar"
      />
      <div className="usuario-info">
        <h3 className="usuario-nombre">{usuario.nombre_usuario_app || usuario.nombre_usuario}</h3>
        {showEmail && <p className="usuario-email">{usuario.email}</p>}
      </div>
    </div>
  );
};

export default UsuarioCard;
