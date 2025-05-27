import axios from 'axios'; 

const API_URL = 'http://localhost:3000';

export async function getUsuarioInfo(email) {
  try {
    const respuesta = await axios.get(`${API_URL}/usuario/datosUsuario`, {
      params: { email }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
    throw err;
  }
}

export async function getUserIdByEmail(email) {
  try {
    const response = await axios.get(`${API_URL}/usuario/obtenerId?email=${email}`);

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
