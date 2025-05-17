import axios from 'axios'; 

export async function getCategorias(){
    try{
        const respuesta = await axios.get('http://localhost:3000/categorias/getCategorias')
        return respuesta.data
    }catch(err){
        console.error('Error al obtener las categorias:', err);
        return [];
    }
}

export async function annadirCategoria(nombreCategoria){
    try {
        const response =await axios.post('http://localhost:3000/categorias/annadirCategoria', { nombre: nombreCategoria });
        return response.data;
      } catch (err) {
        console.error('Error al añadir categoria:', err);
        throw err;
      }
}