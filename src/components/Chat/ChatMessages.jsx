"use client"

import { useState, useRef, useEffect } from "react"
import ChatInfo from "./ChatInfo"

const ChatMessages = ({ messages, currentChat, onSendMessage, isConnected, userId, userEmail }) => {
  const [newMessage, setNewMessage] = useState("")
  const [showChatInfo, setShowChatInfo] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest(".messages-container")
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  // Función para determinar si un mensaje es del usuario actual
  const isOwnMessage = (message) => {
    // Asegurarse de que estamos comparando el mismo tipo de datos
    const messageUserId = typeof message.id_usuario === "string" ? message.id_usuario : String(message.id_usuario)
    const currentUserId = typeof userId === "string" ? userId : String(userId)
    return messageUserId === currentUserId
  }

  // Función para generar una clave única para cada mensaje
  const getMessageKey = (msg, index) => {
    // Si el mensaje tiene id_mensaje, usarlo
    if (msg.id_mensaje !== undefined && msg.id_mensaje !== null) {
      return `msg-${msg.id_mensaje}`
    }

    // Si no tiene id_mensaje pero tiene timestamp, usar una combinación
    if (msg.fecha_mensaje) {
      return `temp-${msg.fecha_mensaje}-${index}`
    }

    // Como último recurso, usar un timestamp actual con el índice
    return `temp-${Date.now()}-${index}`
  }

  const handleHeaderClick = () => {
    setShowChatInfo(true)
  }

  const handleBackToChat = () => {
    setShowChatInfo(false)
  }

  // Si se está mostrando la información del chat, renderizar ChatInfo
  if (showChatInfo) {
    return <ChatInfo currentChat={currentChat} onBack={handleBackToChat} userId={userId} userEmail={userEmail} />
  }

  if (!currentChat) {
    return (
      <div className="chat-messages empty-chat">
        <div className="empty-state">
          <h2>Selecciona un chat para comenzar</h2>
          <p>Elige un chat de la lista para ver los mensajes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-messages">
      <div className="chat-messages-header" onClick={handleHeaderClick}>
        <h2>{currentChat.nombre}</h2>
        <p>{currentChat.descripcion}</p>
        <span className="header-hint">Haz clic para ver información del chat</span>
      </div>

      <div className="messages-container">
        {messages.length > 0 ? (
          <ul className="messages-list">
            {messages.map((msg, index) => (
              <li
                key={getMessageKey(msg, index)}
                className={`message-item ${isOwnMessage(msg) ? "own-message" : "other-message"}`}
              >
                <div className="message-header">
                  <strong>{msg.username}</strong>
                  <span className="message-time">
                    {msg.fecha_mensaje ? new Date(msg.fecha_mensaje).toLocaleTimeString() : ""}
                  </span>
                </div>
                <div className="message-content">{msg.content}</div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <div className="no-messages">
            <p>No hay mensajes en este chat</p>
          </div>
        )}
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !newMessage.trim()}>
          Enviar
        </button>
      </form>
    </div>
  )
}

export default ChatMessages
