"use client"

import { useState } from "react"

const ChatList = ({ chats, currentChat, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChats = chats.filter((chat) => 
    chat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      </div>

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
          <li className="no-chats">
            {searchTerm ? "No se encontraron chats" : "No tienes chats activos"}
          </li>
        )}
      </ul>
    </div>
  )
}

export default ChatList