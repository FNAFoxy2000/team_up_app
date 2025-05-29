import axios from 'axios'; 

const apiURL = import.meta.env.VITE_API_URL

export async function getUsuarioInfo(email) {
  try {
    const respuesta = await axios.get(`${apiURL}/usuario/datosUsuario`, {
      params: { email }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
    throw err;
  }
}
