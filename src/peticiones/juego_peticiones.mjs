import axios from 'axios'; 

const apiURL = import.meta.env.VITE_API_URL

export async function getAllJuegos(){
    try{
        const respuesta = await axios.get(`${apiURL}/juegos/listadoJuegos`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener los datos de los juegos:', err);
        return [];
    }
}

export async function getDatosJuego(nombreJuego){
    try{
        const respuesta = await axios.get(`${apiURL}/juegos/${nombreJuego}`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener los datos del juego:', err);
        // window.location.href = '/error' // puedes o redireccionar a /error (salta 404) o hacer throw err;
        throw err; // si lanzas el error te manda a la pagina de juego no encontrado
        //return []; //con esto da error
    }
}

export async function annadirJuego(datosJuego){
    try {
        const response = await axios.post(`${apiURL}/juegos/annadirJuego`, datosJuego);
        return response.data;
      } catch (err) {
        console.error('Error al añadir juego:', err);
        throw err;
      }
}

export async function editarJuego(juego) {
    try {
        const response = await axios.put(`${apiURL}/juegos/editarJuego`, juego);
        return response.data;
    } catch (err) {
        console.error('Error al actualizar juego:', err);
        throw err;
    }
}

export async function borrarJuego(juego) {
    try {
        const response = await axios.put(`${apiURL}/juegos/borrarJuego`, juego);
        return response.data;
    } catch (err) {
        console.error('Error al borrar juego:', err);
        throw err;
    }
}

export async function getChatsJuego(id_juego){
    try{
        const respuesta = await axios.get(`${apiURL}/juegos/chatsJuego/${id_juego}`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener los datos del juego:', err);
        throw err;
    }
}