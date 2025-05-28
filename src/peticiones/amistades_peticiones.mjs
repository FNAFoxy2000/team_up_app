import axios from 'axios';

export async function getAmistades(email){
    try{
        const respuesta = await axios.get(`http://localhost:3000/amistades/${email}`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener la lista de amigas:', err);
        throw err;
    }
}
