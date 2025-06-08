import axios from 'axios'; 

const apiURL = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export async function getUsuarioPorJuego(id_juego, id_usuario){
  try {
    const respuesta = await axios.get(`${apiURL}/usuarios_juegos/juego/${id_juego}/${id_usuario}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
    // success = true && data != null => hay datos del juego
    // success = true && data == null => no es favorito el juego para este user
  } catch (err) {
    console.error('Error al obtener los datos del usuario en este juego:', err);
    throw err;
  }
}

export async function getJuegosPorUsuario(id_usuario) {
  try {
    const respuesta = await axios.get(`${apiURL}/usuarios_juegos/usuario/${id_usuario}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return respuesta.data;
    // success = true => data con listado de juegos para montar los cards
  } catch (err) {
    console.error('Error al obtener los juegos favoritos del usuario:', err);
    throw err;
  }
}

export async function insertarJuegoDeUsuario(id_usuario, id_juego, game_tag, datosExtra) {
  try {
      const response = await axios.post(`${apiURL}/usuarios_juegos/insertar`,
          {
              id_juego : id_juego,
              id_usuario : id_usuario,
              game_tag : game_tag,
              datosExtraJuego : datosExtra 
          }, 
          {
            headers: {
              'x-api-key': apiKey
            }
          }
      );
      return response.data;
  } catch (err) {
      console.error('Error al insertar los datos del juego:', err);
      throw err;
  }
}

export async function eliminarJuegoDeUsuario(id_usuario, id_juego) {
  try {
    const response = await axios.delete(`${apiURL}/usuarios_juegos/eliminar`, {
      data: {
        id_juego: id_juego,
        id_usuario: id_usuario
      },
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error al eliminar los datos del juego:', err);
    throw err;
  }
}
