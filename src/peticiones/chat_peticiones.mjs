import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY;

export async function getInfoChat(id_chat) {
  try {
    const response = await axios.get(`${apiURL}/chat/${id_chat}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getInfoChats:', error);
    throw error;
  }
}

export async function getUserChats(userId) {
  try {
    const response = await axios.get(`${apiURL}/chat/usuario/${userId}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getUserChats:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const response = await axios.get(`${apiURL}/usuario`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getUsers:', error);
    throw error;
  }
}

export async function getChatMessages(chatId) {
  try {
    const response = await axios.get(`${apiURL}/chat/${chatId}/mensajes`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getChatMessages:', error);
    throw error;
  }
}

export async function createChat(chatData) {
  try {
    const response = await axios.post(`${apiURL}/chat/crearChat`, chatData, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en createChat:', error);
    throw error;
  }
}

export async function abandonarChat(id_usuario, id_chat) {
  try {
    const response = await axios.delete(`${apiURL}/chat/abandonarChat`, {
      data: {
        id_usuario,
        id_chat,
      },
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en createChat:', error);
    throw error;
  }
}

export async function unirseChat(id_usuario, id_chat) {
  try {
    const response = await axios.post(`${apiURL}/chat/unirseChat`, {
      id_usuario,
      id_chat,
    }, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en unirseChat:', error);
    throw error;
  }
}

export async function getChatUsers(chatId) {
  try {
    const response = await axios.get(`${apiURL}/chat/${chatId}/usuarios`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getChatUsers:', error);
    throw error;
  }
}
