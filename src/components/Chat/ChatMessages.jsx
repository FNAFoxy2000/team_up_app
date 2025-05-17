"use client"

import { useState, useRef, useEffect } from "react"

const ChatMessages = ({ messages, currentChat, onSendMessage, isConnected }) => {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  if (!currentChat) {
    return (
      <div className="chat-messages empty-chat">
        <div className="empty-state">
          <h2>Selecciona un chat para comenzar</h2>
          <p>Elige un chat de la lista o inicia un nuevo chat privado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-messages">
      <div className="chat-messages-header">
        <h2>{currentChat.nombre}</h2>
        <p>{currentChat.descripcion}</p>
      </div>

      <div className="messages-container">
        {messages.length > 0 ? (
          <ul className="messages-list">
            {messages.map((msg, index) => (
              <li key={msg.id_mensaje || index} className="message-item">
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
