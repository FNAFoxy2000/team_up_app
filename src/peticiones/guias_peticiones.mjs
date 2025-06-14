import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export async function guardarGuia(id_usuario, id_juego, campeon_nombre, objGuia, privada) {
  try {
    const body = {
      id_usuario: id_usuario,
      id_juego: id_juego,
      campeon_nombre: campeon_nombre,
      contenido_guia: objGuia,
      privada: privada
    };

    const response = await axios.post(`${apiURL}/guias/new`, body, {
      headers: {
        'x-api-key': apiKey
      }
    });
    // console.log(response);
    return response.data;

  } catch (error) {
    console.error('Error guardando la guía:', error);
    throw error;
  }
}

export async function getAllGuias() {
  try {
    const respuesta = await axios.get(`${apiURL}/guias/`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener las guias:', err);
    return [];
  }
}

export async function getAllGuiasUsuario(id_usuario) {
  try {
    const respuesta = await axios.get(`${apiURL}/guias/user/${id_usuario}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener las guias:', err);
    return [];
  }
}

export async function eliminarGuia(id_guia, id_usuario) {
  try {
    const response = await axios.delete(`${apiURL}/guias/delete`, {
      data: {
        id: id_guia,
        id_usuario: id_usuario
      },
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error al eliminar la guía:', err);
    throw err;
  }
}

export async function getGuiaPorId(id_guia) {
  try {
    const response = await axios.get(`${apiURL}/guias/${id_guia}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data.guia;
  } catch (error) {
    console.error('Error al buscar la guía:', error);
    throw error;
  }
}

export async function getCampeones() {
  try {
    const response = await axios.get(`${apiURL}/guias/campeones`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data.campeones;
  } catch (error) {
    console.error('Error al buscar la guía:', error);
    throw error;
  }
}
