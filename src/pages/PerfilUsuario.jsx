import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PerfilUsuario.css';
import { getUsuarioInfo, cambiarNombre } from '../peticiones/usuario_peticiones.mjs';
import { nuevaSolicitudAmistad } from '../peticiones/solicitudes_amistad_peticiones.mjs';
import AuthService from '../services/authService';

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const email = params.get('email');

        if (!email) throw new Error("Email no especificado en la URL");

        const usuarioData = await getUsuarioInfo(email);
        setUsuario(usuarioData);

        const userFromToken = AuthService.getUserFromToken();
        if (userFromToken) {
          setUsuarioActivo(userFromToken);
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    cargarDatos();
  }, [location]);

  const handleCambiarNombre = async () => {
    const nuevoNombre = prompt("Introduce tu nuevo nombre de usuario:");
    if (!nuevoNombre || nuevoNombre.trim() === "") {
      alert("Nombre no válido");
      return;
    }

    try {
      const user = {
        id_usuario: usuario.id_usuario,
        nombre_usuario_app: nuevoNombre.trim()
      };

      await cambiarNombre(user);
      setUsuario(prev => ({
        ...prev,
        nombre_usuario_app: nuevoNombre.trim()
      }));
    } catch (err) {
      alert("Hubo un error al cambiar el nombre.");
      console.error(err);
    }
  };

  const handleSolicitarAmistad = async () => {
    if (!usuarioActivo || !usuario) return;
    if (usuarioActivo.id_usuario === usuario.id_usuario) {
      alert("No puedes enviarte una solicitud a ti mismo.");
      return;
    }

    try {
      const respuesta = await nuevaSolicitudAmistad(usuarioActivo.id_usuario, usuario.id_usuario);
      if (respuesta.success) {
        alert("Solicitud de amistad enviada correctamente.");
      } else {
        alert("No se pudo enviar la solicitud.");
      }
    } catch (error) {
      alert("Error al enviar la solicitud de amistad.");
      console.error(error);
    }
  };

  if (!usuario) return <div>Cargando perfil...</div>;

  const esPerfilPropio = usuarioActivo && usuarioActivo.email === usuario.email;

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

        {esPerfilPropio ? (
          <button className="editar-btn" onClick={handleCambiarNombre}>
            Elegir nombre
          </button>
        ) : (
          <button className="amistad-btn" onClick={handleSolicitarAmistad}>
            Solicitar amistad
          </button>
        )}
      </div>
    </div>
  );
};

export default PerfilUsuario;
