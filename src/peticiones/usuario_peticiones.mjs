import axios from 'axios'; 

export async function getUsuarioInfo(email) {
  try {
    const respuesta = await axios.get('http://localhost:3000/usuario/datosUsuario', {
      params: { email }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
    throw err;
  }
}
