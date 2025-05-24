import axios from 'axios'; 

export async function getAllUsuarios(){
  try {
    const respuesta = await axios.get('http://localhost:3000/usuario/');
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener todos los usuarios:', err);
    throw err;
  }
}

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

export async function cambiarNombre(user) {
    try {
        const response = await axios.put('http://localhost:3000/usuario/cambiarNombre', user);
        return response.data;
    } catch (err) {
        console.error('Error al cambiar el nombre:', err);
        throw err;
    }
}