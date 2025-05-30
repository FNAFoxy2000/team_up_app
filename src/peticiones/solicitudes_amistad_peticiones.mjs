import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL

export async function nuevaSolicitudAmistad(id_remitente, id_destinatario) {
  try {
    const response = await axios.post(`${apiURL}/solicitudes/nueva`, {
      id_remitente,
      id_destinatario
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear nueva solicitud de amistad:', error);
    throw error;
  }
}

export async function getSolicitudesEnviadas(id_remitente) {
  try {
    const response = await axios.post(`${apiURL}/solicitudes/enviadas`, {
      id_remitente
    });
    return response.data;
  } catch (error) {
    console.error('Error al recibir las solicitudes enviadas', error);
    throw error;
  }
}

export async function getSolicitudesRecibidas(id_destinatario) {
  try {
    const response = await axios.post(`${apiURL}/solicitudes/recibidas`, {
      id_destinatario
    });
    return response.data;
  } catch (error) {
    console.error('Error al recibir las solicitudes recibidas:', error);
    throw error;
  }
}

export async function aceptarSolicitud(id) {
    try {
        const response = await axios.put(`${apiURL}/solicitudes/aceptar`, {id});
        return response.data;
    } catch (err) {
        console.error('Error al aceptar la solicitud:', err);
        throw err;
    }
}

export async function rechazarSolicitud(id) {
    try {
        const response = await axios.put(`${apiURL}/solicitudes/rechazar`, {id});
        return response.data;
    } catch (err) {
        console.error('Error al rechazar o cancelar la solicitud:', err);
        throw err;
    }
}

export async function solicitudPendiente(id1, id2) {
  try {
    const response = await axios.get(`${apiURL}/solicitudes/pendiente/${id1}/${id2}`);
    return response.data;
  } catch (err) {
    console.error('Error al verificar solicitud pendiente:', err);
    throw err;
  }
}
