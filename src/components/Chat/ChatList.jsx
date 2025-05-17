"use client"

import { useState } from "react"

const ChatList = ({ chats, currentChat, onSelectChat, onStartPrivateChat }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [otherUserId, setOtherUserId] = useState("")
  const [otherUsername, setOtherUsername] = useState("")
  const [showPrivateChatForm, setShowPrivateChatForm] = useState(false)

  const filteredChats = chats.filter((chat) => chat.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleStartPrivateChat = () => {
    if (otherUserId && otherUsername) {
      onStartPrivateChat(otherUserId, otherUsername)
      setOtherUserId("")
      setOtherUsername("")
      setShowPrivateChatForm(false)
    }
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Mis Chats</h2>
        <input
          type="text"
          placeholder="Buscar chat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="new-chat-btn" onClick={() => setShowPrivateChatForm(!showPrivateChatForm)}>
          {showPrivateChatForm ? "Cancelar" : "Nuevo Chat Privado"}
        </button>
      </div>

      {showPrivateChatForm && (
        <div className="private-chat-form">
          <input
            type="text"
            placeholder="ID del usuario"
            value={otherUserId}
            onChange={(e) => setOtherUserId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nombre del usuario"
            value={otherUsername}
            onChange={(e) => setOtherUsername(e.target.value)}
          />
          <button onClick={handleStartPrivateChat}>Iniciar Chat</button>
        </div>
      )}

      <ul className="chats-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <li
              key={chat.id_chat}
              className={currentChat?.id_chat === chat.id_chat ? "active" : ""}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-item">
                <h3>{chat.nombre}</h3>
                <p>{chat.descripcion}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="no-chats">{searchTerm ? "No se encontraron chats" : "No tienes chats activos"}</li>
        )}
      </ul>
    </div>
  )
}

export default ChatList
