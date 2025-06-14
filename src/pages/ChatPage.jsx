"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import ChatList from "../components/Chat/ChatList"
import ChatMessages from "../components/Chat/ChatMessages"
import { getUserChats } from "../peticiones/chat_peticiones"
import AuthService from "../services/authService.mjs"
import { getUserIdByEmail } from "../peticiones/usuario_peticiones"
import "../components/Chat/chat.css"

const apiURL = import.meta.env.VITE_API_URL

const ChatPage = () => {
  // Estados de autenticación
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Estados de chat
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])

  // Efecto para autenticación y obtención de datos del usuario
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Obtener información del usuario desde el token JWT
        const userData = AuthService.getUserFromToken()

        if (userData) {
          setUser(userData)

          // Obtener el ID del usuario basado en su email
          if (userData.email) {
            try {
              const id = await getUserIdByEmail(userData.email)
              setUserId(id)
            } catch (error) {
              console.error("Error al obtener el ID del usuario:", error)
            }
          }
        } else {
          // Si no hay usuario autenticado, redirigir al login
          navigate("/NoLogin")
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        navigate("/NoLogin")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  // Inicializar Socket.io cuando el usuario está disponible
  useEffect(() => {
    if (!userId || !user) return

    console.log("Inicializando Socket.io con usuario:", { userId, username: user.username })
    const newSocket = io(`${apiURL}`, {
      auth: { serverOffset: 0 },
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [userId, user])

  // Configurar eventos de Socket.io
  useEffect(() => {
    if (!socket) return

    // Eventos de conexión
    socket.on("connect", () => {
      setIsConnected(true)
      // Cargar lista de chats del usuario
      fetchUserChats()
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    // Eventos de chat
    socket.on("load messages", (msgs) => {
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
      // Verificar si este mensaje ya existe en la lista actual
      setMessages((prev) => {
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

  // Obtener los chats del usuario
  const fetchUserChats = async () => {
    try {
      const data = await getUserChats(userId)
      setChats(data)
    } catch (error) {
      console.error("Error al cargar los chats:", error)
    }
  }

  const handleChatLeave = () => {
    console.log("Usuario abandonó un chat, recargando datos...")
    fetchUserChats()
    setCurrentChat(null)
    setMessages([])
  }

  // Unirse a un chat
  const joinChat = (chat) => {
    if (!socket || !isConnected) return

    setCurrentChat(chat)
    socket.emit("join room", {
      idChat: chat.id_chat,
      idUsuario: userId,
      username: user.username,
    })
  }

  // Enviar un mensaje
  const sendMessage = (message) => {
    if (!socket || !isConnected || !currentChat) return

    socket.emit("chat message", message)
  }

  // Mostrar un mensaje de carga mientras verificamos la autenticación
  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!user || !userId) {
    return (
      <div className="error-message">
        <h2>Error: No se pudo cargar la información del usuario</h2>
        <p>Por favor, intenta recargar la página o contacta al administrador.</p>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-content">
          <ChatList chats={chats} currentChat={currentChat} onSelectChat={joinChat} />

          <ChatMessages
            messages={messages}
            currentChat={currentChat}
            onSendMessage={sendMessage}
            isConnected={isConnected}
            userId={userId}
            userEmail={user.email}
            onChatLeave={handleChatLeave}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
