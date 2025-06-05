import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;

export async function guardarGuia(id_usuario, id_juego, campeon_nombre, objGuia, privada) {
  try {
    const body = {
      id_usuario: id_usuario,
      id_juego: id_juego,
      campeon_nombre: campeon_nombre,
      contenido_guia: objGuia,
      privada: privada
    };

    const response = await axios.post(`${apiURL}/guias/new`, body);
    console.log(response);
    return response.data;

  } catch (error) {
    console.error('Error guardando la guía:', error);
    throw error;
  }
}

