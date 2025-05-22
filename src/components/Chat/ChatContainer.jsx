"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import ChatList from "./ChatList"
import ChatMessages from "./ChatMessages"
import { getUserChats } from "../../services/chatService"
import "./Chat.css"

const ChatContainer = ({ userId, username }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])

  // Inicializar Socket.io cuando el usuario está disponible
  useEffect(() => {
    if (!userId) return

    console.log("Inicializando Socket.io con usuario:", { userId, username })
    const newSocket = io("http://localhost:3000", {
      auth: { serverOffset: 0 },
    })

    setSocket(newSocket)

    // Limpiar socket al desmontar
    return () => {
      newSocket.disconnect()
    }
  }, [userId, username])

  // Configurar eventos de Socket.io
  useEffect(() => {
    if (!socket) return

    // Eventos de conexión
    socket.on("connect", () => {
      // console.log("Conectado al servidor")
      setIsConnected(true)

      // Cargar lista de chats del usuario
      fetchUserChats()
    })

    socket.on("disconnect", () => {
      // console.log("Desconectado del servidor")
      setIsConnected(false)
    })

    // Eventos de chat
    socket.on("load messages", (msgs) => {
      // console.log("Mensajes cargados:", msgs)

      // Verificar si hay mensajes con el mismo id_mensaje
      const messageIds = {}
      msgs.forEach((msg) => {
        if (msg.id_mensaje !== undefined && msg.id_mensaje !== null) {
          if (messageIds[msg.id_mensaje]) {
            console.warn(`Mensaje duplicado encontrado con id_mensaje: ${msg.id_mensaje}`)
          }
          messageIds[msg.id_mensaje] = true
        }
      })

      setMessages(msgs)
    })

    socket.on("chat message", (msg) => {
      // console.log("Nuevo mensaje recibido:", msg)

      // Verificar si este mensaje ya existe en la lista actual
      setMessages((prev) => {
        // Comprobar si ya existe un mensaje con el mismo id_mensaje (si tiene)
        if (msg.id_mensaje && prev.some((m) => m.id_mensaje === msg.id_mensaje)) {
          console.warn(`Mensaje con id_mensaje ${msg.id_mensaje} ya existe en la lista`)
          return prev
        }

        return [...prev, msg]
      })
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("load messages")
      socket.off("chat message")
    }
  }, [socket, userId])

  // Función para obtener los chats del usuario
  const fetchUserChats = async () => {
    try {
      const data = await getUserChats(userId)
      // console.log("Chats del usuario:", data)
      setChats(data)
    } catch (error) {
      console.error("Error al cargar los chats:", error)
    }
  }

  // Función para unirse a un chat
  const joinChat = (chat) => {
    if (!socket || !isConnected) return

    // console.log("Uniéndose al chat:", chat)
    setCurrentChat(chat)
    socket.emit("join room", {
      idChat: chat.id_chat,
      idUsuario: userId,
      username: username,
    })
  }

  // Función para enviar un mensaje
  const sendMessage = (message) => {
    if (!socket || !isConnected || !currentChat) return

    // console.log("Enviando mensaje:", message)
    socket.emit("chat message", message)
  }

  // Función para desconectar/conectar
  const toggleConnection = () => {
    if (isConnected) {
      socket.disconnect()
    } else {
      socket.connect()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Team Up Chat</h1>
        <div className="user-controls">
          <span>Conectado como: {username}</span>
          <button onClick={toggleConnection}>{isConnected ? "Desconectar" : "Conectar"}</button>
        </div>
      </div>

      <div className="chat-content">
        <ChatList chats={chats} currentChat={currentChat} onSelectChat={joinChat} />

        <ChatMessages
          messages={messages}
          currentChat={currentChat}
          onSendMessage={sendMessage}
          isConnected={isConnected}
          userId={userId}
        />
      </div>
    </div>
  )
}

export default ChatContainer
