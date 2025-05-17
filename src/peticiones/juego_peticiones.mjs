import axios from 'axios'; 

export async function getAllJuegos(){
    try{
        const respuesta = await axios.get('http://localhost:3000/juegos/listadoJuegos')
        return respuesta.data
    }catch(err){
        console.error('Error al obtener los datos de los juegos:', err);
        return [];
    }
}

export async function getDatosJuego(nombreJuego){
    try{
        const respuesta = await axios.get(`http://localhost:3000/juegos/${nombreJuego}`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener los datos del juego:', err);
        return [];
    }
}

export async function annadirJuego(datosJuego){
    try {
        const response = await axios.post('http://localhost:3000/juegos/annadirJuego', datosJuego);
        return response.data;
      } catch (err) {
        console.error('Error al añadir juego:', err);
        throw err;
      }
}

export async function editarJuego(juego) {
    try {
        const response = await axios.put('http://localhost:3000/juegos/editarJuego', juego);
        return response.data;
    } catch (err) {
        console.error('Error al actualizar juego:', err);
        throw err;
    }
}

export async function borrarJuego(juego) {
    try {
        const response = await axios.put('http://localhost:3000/juegos/borrarJuego', juego);
        return response.data;
    } catch (err) {
        console.error('Error al borrar juego:', err);
        throw err;
    }
}