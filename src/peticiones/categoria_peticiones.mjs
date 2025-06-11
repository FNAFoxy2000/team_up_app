import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY;

export async function getCategorias() {
    try {
        const respuesta = await axios.get(`${apiURL}/categorias/getCategorias`, {
            headers: {
                'x-api-key': apiKey
            }
        })
        return respuesta.data
    } catch (err) {
        console.error('Error al obtener las categorias:', err);
        return [];
    }
}

export async function annadirCategoria(nombreCategoria) {
    try {
        const response = await axios.post(`${apiURL}/categorias/annadirCategoria`, { nombre: nombreCategoria }, {
            headers: {
                'x-api-key': apiKey
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error al añadir categoria:', err);
        throw err;
    }
}
