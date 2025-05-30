import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PerfilUsuario.css';
import { getUsuarioInfo, cambiarNombre } from '../peticiones/usuario_peticiones.mjs';
import {
  nuevaSolicitudAmistad,
  getSolicitudesEnviadas,
  getSolicitudesRecibidas,
  solicitudPendiente,
  aceptarSolicitud,
  rechazarSolicitud
} from '../peticiones/solicitudes_amistad_peticiones.mjs';
import {
  getAmistades,
  sonAmigos,
  cancelarAmistad
} from '../peticiones/amistades_peticiones.mjs';
import AuthService from '../services/authService';
import TablaSolicitudes from '../components/tablaSolicitudes';

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [amistades, setAmistades] = useState([]);
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [esAmigo, setEsAmigo] = useState(false);
  const [estadoSolicitud, setEstadoSolicitud] = useState({ estado: 0, id_solicitud: null });
  const location = useLocation();

  const userFromToken = AuthService.getUserFromToken();
  if (!userFromToken) {
    window.location.href = '/LoginError';
  }

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

          if (userFromToken.email === email) {
            const [amistadesData, recibidas, enviadas] = await Promise.all([
              getAmistades(userFromToken.email),
              getSolicitudesRecibidas(userFromToken.id_usuario),
              getSolicitudesEnviadas(userFromToken.id_usuario)
            ]);

            if (amistadesData.success) setAmistades(amistadesData.data);
            if (recibidas.success) setSolicitudesRecibidas(recibidas.data);
            if (enviadas.success) setSolicitudesEnviadas(enviadas.data);
          } else {
            const amistad = await sonAmigos(userFromToken.id_usuario, usuarioData.id_usuario);
            if (amistad.success && amistad.data === true) {
              setEsAmigo(true);
            } else {
              setEsAmigo(false);
              const solicitud = await solicitudPendiente(userFromToken.id_usuario, usuarioData.id_usuario);
              if (solicitud.success && solicitud.estado !== undefined) {
                setEstadoSolicitud({
                  estado: solicitud.estado,
                  id_solicitud: solicitud.id_solicitud
                });
              }
            }
          }
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
      await cambiarNombre({
        id_usuario: usuario.id_usuario,
        nombre_usuario_app: nuevoNombre.trim()
      });

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
    if (!usuarioActivo || !usuario || usuarioActivo.id_usuario === usuario.id_usuario) return;

    try {
      const respuesta = await nuevaSolicitudAmistad(usuarioActivo.id_usuario, usuario.id_usuario);
      if (respuesta.success) {
        if (respuesta.data.success) {
          alert("Solicitud de amistad enviada correctamente.");
          setEstadoSolicitud({ estado: 1, id_solicitud: respuesta.data.id_solicitud });
        } else {
          alert("No puedes solicitar amistad porque ya lo has hecho recientemente");
        }
      } else {
        alert("No se pudo enviar la solicitud.");
      }
    } catch (error) {
      alert("Error al enviar la solicitud de amistad.");
      console.error(error);
    }
  };

  const handleCancelarAmistad = async () => {
    if (!usuarioActivo || !usuario || usuarioActivo.id_usuario === usuario.id_usuario) return;

    const confirmacion = window.confirm("¿Estás seguro de que quieres cancelar esta amistad?");
    if (!confirmacion) return;

    try {
      const respuesta = await cancelarAmistad(usuarioActivo.id_usuario, usuario.id_usuario);
      if (respuesta.success) {
        alert("Amistad cancelada correctamente.");
        setEsAmigo(false);
        setEstadoSolicitud({ estado: 0, id_solicitud: null });
      } else {
        alert("No se pudo cancelar la amistad.");
      }
    } catch (error) {
      alert("Error al cancelar la amistad.");
      console.error(error);
    }
  };

  const handleAceptarAmistad = async () => {
    if (!estadoSolicitud.id_solicitud) return;
    try {
      const respuesta = await aceptarSolicitud(estadoSolicitud.id_solicitud);
      if (respuesta.result.success) {
        alert("Solicitud aceptada.");
        setEsAmigo(true);
        setEstadoSolicitud({ estado: 0, id_solicitud: null });
      } else {
        alert("No se pudo aceptar la solicitud.");
      }
    } catch (err) {
      console.error('Error al aceptar la solicitud:', err);
      alert("Error al aceptar la solicitud.");
    }
  };

  const handleCancelarSolicitud = async () => {
    if (!estadoSolicitud.id_solicitud) return;
    const confirmar = window.confirm("¿Estás seguro de cancelar esta solicitud?");
    if (!confirmar) return;

    try {
      const respuesta = await rechazarSolicitud(estadoSolicitud.id_solicitud);
      if (respuesta.result.success) {
        alert("Solicitud cancelada.");
        setEstadoSolicitud({ estado: 0, id_solicitud: null });
      } else {
        alert("No se pudo cancelar la solicitud.");
      }
    } catch (err) {
      console.error('Error al cancelar la solicitud:', err);
      alert("Error al cancelar la solicitud.");
    }
  };

  const esPerfilPropio = usuarioActivo && usuarioActivo.email === usuario.email;

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

        {esPerfilPropio ? (
          <button className="editar-btn" onClick={handleCambiarNombre}>
            Elegir nombre
          </button>
        ) : esAmigo ? (
          <button className="cancelar-btn" onClick={handleCancelarAmistad}>
            Cancelar amistad
          </button>
        ) : (
          <>
            {estadoSolicitud.estado === 0 && (
              <button className="amistad-btn" onClick={handleSolicitarAmistad}>
                Solicitar amistad
              </button>
            )}
            {estadoSolicitud.estado === 1 && (
              <button className="cancelar-btn" onClick={handleCancelarSolicitud}>
                Cancelar solicitud
              </button>
            )}
            {estadoSolicitud.estado === 2 && (
              <button className="aceptar-btn" onClick={handleAceptarAmistad}>
                Aceptar solicitud
              </button>
            )}
          </>
        )}
      </div>

      {esPerfilPropio && (
        <div className="solicitudes-section">
          <h3>Solicitudes de amistad</h3>
          <TablaSolicitudes
            amistades={amistades || []}
            enviadas={solicitudesEnviadas || []}
            recibidas={solicitudesRecibidas || []}
          />
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
