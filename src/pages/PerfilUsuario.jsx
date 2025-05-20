import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PerfilUsuario.css';
import { getUsuarioInfo } from '../peticiones/usuario_peticiones.mjs';

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const email = params.get('email');

        if (!email) throw new Error("Email no especificado en la URL");

        const usuarioData = await getUsuarioInfo(email);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    cargarDatos();
  }, [location]);

  if (!usuario) return <div>Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <img src={usuario.avatar} alt="Avatar" className="perfil-avatar" />
        <div className="perfil-info">
          <h2>{usuario.nombre_usuario}</h2>
          {usuario.nombre_usuario_app && (
            <p className="nickname">@{usuario.nombre_usuario_app}</p>
          )}
          <p>Email: {usuario.email}</p>
          <p>Miembro desde: {new Date(usuario.fecha_registro).toLocaleDateString()}</p>
        </div>
        <button className="editar-btn">Editar perfil</button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
