import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY;

export async function getAllJuegos() {
  try {
    const respuesta = await axios.get(`${apiURL}/juegos/listadoJuegos`, {
      headers: {
        'x-api-key': apiKey
      }
    })
    return respuesta.data
  } catch (err) {
    console.error('Error al obtener los datos de los juegos:', err);
    return [];
  }
}

export async function getDatosJuego(nombreJuego) {
  try {
    const respuesta = await axios.get(`${apiURL}/juegos/${nombreJuego}`, {
      headers: {
        'x-api-key': apiKey
      }
    })
    return respuesta.data
  } catch (err) {
    console.error('Error al obtener los datos del juego:', err);
    throw err; 
  }
}

export async function annadirJuego(datosJuego) {
  try {
    const response = await axios.post(`${apiURL}/juegos/annadirJuego`, datosJuego, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error al añadir juego:', err);
    throw err;
  }
}

export async function editarJuego(juego) {
  try {
    const response = await axios.put(`${apiURL}/juegos/editarJuego`, juego, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error al actualizar juego:', err);
    throw err;
  }
}

export async function borrarJuego(juego) {
  try {
    const response = await axios.put(`${apiURL}/juegos/borrarJuego`, juego, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error al borrar juego:', err);
    throw err;
  }
}

export async function getChatsJuego(id_juego) {
  try {
    const respuesta = await axios.get(`${apiURL}/juegos/chatsJuego/${id_juego}`, {
      headers: {
        'x-api-key': apiKey
      }
    })
    return respuesta.data
  } catch (err) {
    console.error('Error al obtener los datos del juego:', err);
    throw err;
  }
}
