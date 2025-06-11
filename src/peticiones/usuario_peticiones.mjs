import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export async function getAllUsuarios() {
  try {
    const respuesta = await axios.get(`${apiURL}/usuario/`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener todos los usuarios:', err);
    throw err;
  }
}

export async function getUsuarioInfo(email) {
  try {
    const respuesta = await axios.get(`${apiURL}/usuario/datosUsuario`, {
      params: { email },
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
    throw err;
  }
}

export async function getUserIdByEmail(email) {
  try {
    const response = await axios.get(`${apiURL}/usuario/obtenerId?email=${email}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

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

export async function cambiarNombre(user) {
  try {
    const response = await axios.put(`${apiURL}/usuario/cambiarNombre`, user, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error al cambiar el nombre:', err);
    throw err;
  }
}
