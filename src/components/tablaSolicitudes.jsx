import { useState } from 'react';
import './tablaSolicitudes.css';
import {
  aceptarSolicitud,
  rechazarSolicitud
} from '../peticiones/solicitudes_amistad_peticiones.mjs';
import { cancelarAmistad } from '../peticiones/amistades_peticiones.mjs';
import AuthService from '../services/authService';
import { showError } from './Toast';

const TablaSolicitudes = ({ amistades = [], enviadas = [], recibidas = [] }) => {
  const [pestañaActiva, setPestañaActiva] = useState('amistades');

  const solicitudesRaw =
    pestañaActiva === 'amistades'
      ? amistades
      : pestañaActiva === 'enviadas'
      ? enviadas
      : recibidas;

  const solicitudes = Array.isArray(solicitudesRaw) ? solicitudesRaw : [];

  const handleRedireccionPerfil = (email) => {
    window.location.href = `/usuario/datosUsuario?email=${encodeURIComponent(email)}`;
  };

  const handleCancelarAmistad = async (email) => {
    try {
      const confirmacion = window.confirm(`¿Estás seguro de que quieres cancelar la amistad con ${email}?`);
      if (!confirmacion) return;

      const usuarioActual = AuthService.getUserFromToken();
      if (!usuarioActual) {
        showError("No se pudo obtener el usuario actual.");
        return;
      }

      const amigo = amistades.find((a) => a.email === email);
      if (!amigo) {
        showError("No se encontró la amistad.");
        return;
      }

      await cancelarAmistad(amigo.id_usuario, usuarioActual.id_usuario);
      window.location.reload();
    } catch (error) {
      console.error('Error al cancelar amistad:', error);
    }
  };

  return (
    <div className="tabla-solicitudes-container">
      <div className="tabs">
        <button
          className={pestañaActiva === 'amistades' ? 'tab active' : 'tab'}
          onClick={() => setPestañaActiva('amistades')}
        >
          Amistades
        </button>
        <button
          className={pestañaActiva === 'enviadas' ? 'tab active' : 'tab'}
          onClick={() => setPestañaActiva('enviadas')}
        >
          Enviadas
        </button>
        <button
          className={pestañaActiva === 'recibidas' ? 'tab active' : 'tab'}
          onClick={() => setPestañaActiva('recibidas')}
        >
          Recibidas
          {Array.isArray(recibidas) && recibidas.length > 0 && (
            <span className="notificacion-dot" />
          )}
        </button>
      </div>

      <table className="tabla-solicitudes">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nombre</th>
            <th>Email</th>
            <th colSpan="2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan="5" className="mensaje-vacio">
                No hay {pestañaActiva}.
              </td>
            </tr>
          ) : (
            solicitudes.map((item, idx) => {
              const nombre =
                pestañaActiva === 'amistades'
                  ? item.nombre_usuario
                  : pestañaActiva === 'enviadas'
                  ? item.nombre_destinatario
                  : item.nombre_remitente;

              const email =
                pestañaActiva === 'amistades'
                  ? item.email
                  : pestañaActiva === 'enviadas'
                  ? item.email_destinatario
                  : item.email_remitente;

              const avatar =
                pestañaActiva === 'amistades'
                  ? item.avatar
                  : pestañaActiva === 'enviadas'
                  ? item.avatar_destinatario
                  : item.avatar_remitente;

              return (
                <tr
                  key={idx}
                  onClick={() => handleRedireccionPerfil(email)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      className="avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  </td>
                  <td>{nombre}</td>
                  <td>{email}</td>
                  <td>
                    {pestañaActiva === 'amistades' ? (
                      <button
                        className="accion-btn cancelar"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelarAmistad(email);
                        }}
                      >
                        Cancelar amistad
                      </button>
                    ) : pestañaActiva === 'enviadas' ? (
                      <button
                        className="accion-btn cancelar"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirmacion = window.confirm("¿Seguro que quieres cancelar esta solicitud?");
                          if (!confirmacion) return;
                          await rechazarSolicitud(item.id_solicitud);
                          window.location.reload();
                        }}
                      >
                        Cancelar
                      </button>
                    ) : (
                      <>
                        <button
                          className="accion-btn aceptar"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await aceptarSolicitud(item.id_solicitud);
                            window.location.reload();
                          }}
                        >
                          Aceptar
                        </button>
                        <button
                          className="accion-btn rechazar"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const confirmacion = window.confirm("¿Seguro que quieres rechazar esta solicitud?");
                            if (!confirmacion) return;
                            await rechazarSolicitud(item.id_solicitud);
                            window.location.reload();
                          }}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                  <td></td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicitudes;
