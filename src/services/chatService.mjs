import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function getUserChats(userId) {
  try {
    const response = await axios.get(`${API_URL}/chat/usuario/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getUserChats:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const response = await axios.get(`${API_URL}/usuario`);
    return response.data;
  } catch (error) {
    console.error('Error en getUsers:', error);
    throw error;
  }
}

export async function getChatMessages(chatId) {
  try {
    const response = await axios.get(`${API_URL}/chat/${chatId}/mensajes`);
    return response.data;
  } catch (error) {
    console.error('Error en getChatMessages:', error);
    throw error;
  }
}