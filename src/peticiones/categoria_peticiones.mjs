import axios from 'axios'; 

const apiURL = import.meta.env.VITE_API_URL

export async function getCategorias(){
    try{
        const respuesta = await axios.get(`${apiURL}/categorias/getCategorias`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener las categorias:', err);
        return [];
    }
}

export async function annadirCategoria(nombreCategoria){
    try {
        const response =await axios.post(`${apiURL}/categorias/annadirCategoria`, { nombre: nombreCategoria });
        return response.data;
      } catch (err) {
        console.error('Error al añadir categoria:', err);
        throw err;
      }
}