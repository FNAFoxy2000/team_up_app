import axios from 'axios';

export async function nuevaSolicitudAmistad(id_remitente, id_destinatario) {
  try {
    const response = await axios.post('http://localhost:3000/solicitudes/nueva', {
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
    const response = await axios.post('http://localhost:3000/solicitudes/enviadas', {
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
    const response = await axios.post('http://localhost:3000/solicitudes/recibidas', {
      id_destinatario
    });
    return response.data;
  } catch (error) {
    console.error('Error al recibir las solicitudes recibidas:', error);
    throw error;
  }
}

export async function aceptarSolicitud(id) {
  console.log(id);
    try {
        const response = await axios.put('http://localhost:3000/solicitudes/aceptar', {id});
        return response.data;
    } catch (err) {
        console.error('Error al aceptar la solicitud:', err);
        throw err;
    }
}

export async function rechazarSolicitud(id) {
    try {
        const response = await axios.put('http://localhost:3000/solicitudes/rechazar', {id});
        return response.data;
    } catch (err) {
        console.error('Error al rechazar o cancelar la solicitud:', err);
        throw err;
    }
}
