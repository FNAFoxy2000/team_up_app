import { useState } from 'react';
import './tablaSolicitudes.css';
import { aceptarSolicitud, rechazarSolicitud } from '../peticiones/solicitudes_amistad_peticiones.mjs';

const TablaSolicitudes = ({ enviadas = [], recibidas = [] }) => {
  const [pestañaActiva, setPestañaActiva] = useState('enviadas');

  // Asegurar que siempre sea un array válido
  const solicitudesRaw = pestañaActiva === 'enviadas' ? enviadas : recibidas;
  const solicitudes = Array.isArray(solicitudesRaw) ? solicitudesRaw : [];

  return (
    <div className="tabla-solicitudes-container">
      <div className="tabs">
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
            <th>Estado</th>
            <th colSpan="2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan="6" className="mensaje-vacio">
                No hay solicitudes {pestañaActiva}.
              </td>
            </tr>
          ) : (
            solicitudes.map((solicitud) => (
              <tr key={solicitud.id_solicitud}>
                <td>
                  <img
                    src={
                      pestañaActiva === 'enviadas'
                        ? solicitud.avatar_destinatario
                        : solicitud.avatar_remitente
                    }
                    alt="Avatar"
                    className="avatar-img"
                  />
                </td>
                <td>
                  {pestañaActiva === 'enviadas'
                    ? solicitud.nombre_destinatario
                    : solicitud.nombre_remitente}
                </td>
                <td>
                  {pestañaActiva === 'enviadas'
                    ? solicitud.email_destinatario
                    : solicitud.email_remitente}
                </td>
                <td className="estado">{solicitud.estado}</td>
                <td>
                  {pestañaActiva === 'enviadas' ? (
                    <button 
                      className="accion-btn cancelar"
                      onClick={() => rechazarSolicitud(solicitud.id_solicitud)}
                    >
                      Cancelar
                    </button>
                  ) : (
                    <button 
                      className="accion-btn aceptar"
                      onClick={() => aceptarSolicitud(solicitud.id_solicitud)}
                    >
                      Aceptar
                    </button>
                    
                  )}
                </td>
                <td>
                  {pestañaActiva === 'enviadas' ? null : (
                    <button 
                      className="accion-btn rechazar"
                      onClick={() => rechazarSolicitud(solicitud.id_solicitud)}
                    >Rechazar</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicitudes;
