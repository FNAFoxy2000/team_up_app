import { useState } from 'react';
import './tablaSolicitudes.css';
import {
  aceptarSolicitud,
  rechazarSolicitud
} from '../peticiones/solicitudes_amistad_peticiones.mjs';

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

  const handleCancelarAmistad = (email) => {
    alert(`Función para cancelar amistad con ${email} aún no implementada.`);
    // Aquí podrías llamar a una función real como cancelarAmistad(email)
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
                    <img src={avatar} alt="Avatar" className="avatar-img" />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          rechazarSolicitud(item.id_solicitud);
                        }}
                      >
                        Cancelar
                      </button>
                    ) : (
                      <>
                        <button
                          className="accion-btn aceptar"
                          onClick={(e) => {
                            e.stopPropagation();
                            aceptarSolicitud(item.id_solicitud);
                          }}
                        >
                          Aceptar
                        </button>
                        <button
                          className="accion-btn rechazar"
                          onClick={(e) => {
                            e.stopPropagation();
                            rechazarSolicitud(item.id_solicitud);
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
