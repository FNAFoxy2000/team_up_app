import axios from 'axios';

export async function getAmistades(email){
    try{
        const respuesta = await axios.get(`http://localhost:3000/amistades/${email}`)
        return respuesta.data
    }catch(err){
        console.error('Error al obtener la lista de amigos:', err);
        throw err;
    }
}

export async function sonAmigos(id1, id2){
    try{
        const respuesta = await axios.get(`http://localhost:3000/amistades/sonAmigos/${id1}/${id2}`)
        return respuesta.data
    } catch(err){
        console.error('Error al obtener si son amigos:', err);
    }
}

export async function cancelarAmistad(id1, id2) {
  try {
    const respuesta = await axios.delete("http://localhost:3000/amistades/eliminar", {
      data: {
        id1: id1,
        id2: id2
      }
    });
    return respuesta.data;
  } catch (err) {
    console.error('Error al cancelar la amistad:', err);
  }
}
