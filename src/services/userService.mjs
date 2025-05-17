import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function getUserIdByUsername(username) {
  try {
    const response = await axios.get(`${API_URL}/usuario/obtenerId?nombre_usuario=${username}`);

    if (response.data && response.data.id_usuario !== undefined) {
      return response.data.id_usuario;
    } else {
      console.error('Respuesta inesperada del servidor:', response.data);
      throw new Error('La respuesta del servidor no contiene el ID del usuario');
    }
  } catch (error) {
    console.error('Error al obtener ID del usuario:', error);
    throw error;
  }
}