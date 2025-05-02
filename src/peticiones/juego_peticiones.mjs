import axios from 'axios'; 

export async function getDatosJuego(id_juego){
    try{
        const respuesta = await axios.get(`http://localhost:3000/juego/${id_juego}`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener los datos del juego:', err);
        return [];
    }
}