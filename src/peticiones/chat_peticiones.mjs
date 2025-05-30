import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL

export async function getUserChats(userId) {
  try {
    const response = await axios.get(`${apiURL}/chat/usuario/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getUserChats:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const response = await axios.get(`${apiURL}/usuario`);
    return response.data;
  } catch (error) {
    console.error('Error en getUsers:', error);
    throw error;
  }
}

export async function getChatMessages(chatId) {
  try {
    const response = await axios.get(`${apiURL}/chat/${chatId}/mensajes`);
    return response.data;
  } catch (error) {
    console.error('Error en getChatMessages:', error);
    throw error;
  }
}

export async function createChat(chatData) {
  try {
    const response = await axios.post(`${API_URL}/chat/crearChat`, chatData);
    return response.data;
  } catch (error) {
    console.error('Error en createChat:', error);
    throw error;
  }
}
