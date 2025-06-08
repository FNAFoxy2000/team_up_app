import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export async function getAmistades(email) {
  try {
    const respuesta = await axios.get(`${apiURL}/amistades/${email}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener la lista de amigos:', err);
    throw err;
  }
}

export async function sonAmigos(id1, id2) {
  try {
    const respuesta = await axios.get(`${apiURL}/amistades/sonAmigos/${id1}/${id2}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al obtener si son amigos:', err);
    throw err;
  }
}

export async function cancelarAmistad(id1, id2) {
  try {
    const respuesta = await axios.delete(`${apiURL}/amistades/eliminar`, {
      headers: {
        'x-api-key': apiKey
      },
      data: {
        id1: id1,
        id2: id2
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al cancelar la amistad:', err);
    throw err;
  }
}
