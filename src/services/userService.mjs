import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL

export async function getUserIdByEmail(email) {
  try {
    const response = await axios.get(`${apiURL}/usuario/obtenerId?email=${email}`);

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