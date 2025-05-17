import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import { getUserChats } from '../../services/chatService';
import './Chat.css';

// Ahora recibimos userId y username como props
const ChatContainer = ({ userId, username }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Inicializar Socket.io cuando el componente se monta
  useEffect(() => {
    if (userId && username) {
      const newSocket = io('http://localhost:3000', {
        auth: { serverOffset: 0 }
      });
      
      setSocket(newSocket);
      
      // Limpiar socket al desmontar
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId, username]);

  // Configurar eventos de Socket.io
  useEffect(() => {
    if (!socket) return;

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('Conectado al servidor');
      setIsConnected(true);
      
      // Cargar lista de chats del usuario
      fetchUserChats();
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setIsConnected(false);
    });

    // Eventos de chat
    socket.on('load messages', (msgs) => {
      setMessages(msgs);
    });

    socket.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('load messages');
      socket.off('chat message');
    };
  }, [socket]);

  // Función para obtener los chats del usuario
  const fetchUserChats = async () => {
    try {
      if (!userId) return;
      const data = await getUserChats(userId);
      setChats(data);
    } catch (error) {
      console.error('Error al cargar los chats:', error);
    }
  };

  // Función para unirse a un chat
  const joinChat = (chat) => {
    if (!socket || !isConnected) return;
    
    setCurrentChat(chat);
    socket.emit('join room', {
      idChat: chat.id_chat,
      idUsuario: userId,
      username: username
    });
  };

  // Función para iniciar un chat privado
  const startPrivateChat = (otherUserId, otherUsername) => {
    if (!socket || !isConnected) return;
    
    socket.emit('private chat', {
      otherUserId,
      userId,
      username
    });
    
    // Actualizamos el chat actual con información temporal hasta que se cargue
    setCurrentChat({
      id_chat: `private_${userId}_${otherUserId}`,
      nombre: `Chat con ${otherUsername}`,
      descripcion: 'Chat privado'
    });
  };

  // Función para enviar un mensaje
  const sendMessage = (message) => {
    if (!socket || !isConnected || !currentChat) return;
    
    socket.emit('chat message', message);
  };

  // Función para desconectar/conectar
  const toggleConnection = () => {
    if (isConnected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Team Up Chat</h1>
        <div className="user-controls">
          <span>Conectado como: {username}</span>
          <button onClick={toggleConnection}>
            {isConnected ? 'Desconectar' : 'Conectar'}
          </button>
        </div>
      </div>
      
      <div className="chat-content">
        <ChatList 
          chats={chats} 
          currentChat={currentChat} 
          onSelectChat={joinChat}
          onStartPrivateChat={startPrivateChat}
        />
        
        <ChatMessages 
          messages={messages} 
          currentChat={currentChat}
          onSendMessage={sendMessage}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default ChatContainer;