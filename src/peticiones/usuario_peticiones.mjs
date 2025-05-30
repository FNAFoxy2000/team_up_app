import axios from 'axios'; 

const apiURL = import.meta.env.VITE_API_URL

export async function getAllUsuarios(){
  try {
    const respuesta = await axios.get(`${apiURL}/usuario/`);
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener todos los usuarios:', err);
    throw err;
  }
}

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

export async function cambiarNombre(user) {
    try {
        const response = await axios.put(`${apiURL}/usuario/cambiarNombre`, user);
        return response.data;
    } catch (err) {
        console.error('Error al cambiar el nombre:', err);
        throw err;
    }
}