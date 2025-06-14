"use client"

import { useState, useEffect } from "react"
import { getChatUsers, getInfoChat, abandonarChat, unirseChat } from "../../peticiones/chat_peticiones.mjs"
import { getAmistades } from "../../peticiones/amistades_peticiones.mjs"
import { getAllUsuarios } from "../../peticiones/usuario_peticiones.mjs"
import { ArrowLeft, Users, Calendar, Gamepad2, Crown, Globe, Lock, UserMinus, UserPlus, LogOut } from "lucide-react"

const ChatInfo = ({ currentChat, onBack, userId, userEmail, onChatLeave }) => {
  const [usuarios, setUsuarios] = useState([])
  const [amigos, setAmigos] = useState([])
  const [todosUsuarios, setTodosUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [chatInfo, setChatInfo] = useState(null)
  const [addingUser, setAddingUser] = useState(false)
  const [addUserError, setAddUserError] = useState("")
  const [activeTab, setActiveTab] = useState("amigos")
  const [abandonandoChat, setAbandonandoChat] = useState(false)

  useEffect(() => {
    const fetchChatInfo = async () => {
      if (!currentChat?.id_chat) return

      try {
        setLoading(true)
        setError("")

        // Obtener información completa del chat
        const chatData = await getInfoChat(currentChat.id_chat)
        setChatInfo(chatData[0])

        // Obtener usuarios del chat
        const usersData = await getChatUsers(currentChat.id_chat)
        // console.log("Usuarios del chat:", usersData)
        setUsuarios(usersData)

        // Obtener amigos del usuario actual
        if (userEmail) {
          const amigosResponse = await getAmistades(userEmail)
          const amigosData = amigosResponse?.data || []
          setAmigos(amigosData)
        }

        // Obtener todos los usuarios
        const todosUsuariosResponse = await getAllUsuarios()

        const todosUsuariosData = todosUsuariosResponse?.data || todosUsuariosResponse || []
        setTodosUsuarios(todosUsuariosData)
      } catch (error) {
        console.error("Error al obtener información del chat:", error)
        setError("Error al cargar la información del chat")
      } finally {
        setLoading(false)
      }
    }

    fetchChatInfo()
  }, [currentChat, userId, userEmail])

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"

    try {
      return dateString.split("T")[0]
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return "Fecha no válida"
    }
  }

  const handleExpulsarUsuario = async (id_usuario) => {
    try {
      await abandonarChat(id_usuario, displayData.id_chat)
      // Recargar la lista de usuarios
      const usersData = await getChatUsers(displayData.id_chat)
      setUsuarios(usersData)
    } catch (error) {
      console.error("Error al expulsar usuario:", error)
      setError("Error al expulsar al usuario")
    }
  }

  const handleAbandonarChat = async () => {
    if (!userId || !displayData?.id_chat) return

    try {
      setAbandonandoChat(true)
      setError("")

      await abandonarChat(userId, displayData.id_chat)

      onBack()

      if (typeof onChatLeave === "function") {
        onChatLeave()
      }
    } catch (error) {
      console.error("Error al abandonar el chat:", error)
      setError("Error al abandonar el chat. Inténtalo de nuevo.")
      setAbandonandoChat(false)
    }
  }

  const handleAñadirUsuario = async (id_usuario) => {
    try {
      setAddingUser(true)
      setAddUserError("")

      // Añadir el usuario al chat
      await unirseChat(id_usuario, displayData.id_chat)

      // Recargar la lista de usuarios
      const usersData = await getChatUsers(displayData.id_chat)
      setUsuarios(usersData)
    } catch (error) {
      console.error("Error al añadir usuario:", error)
      setAddUserError("Error al añadir el usuario.")
    } finally {
      setAddingUser(false)
    }
  }

  const normalizeId = (id) => {
    return typeof id === "string" ? Number.parseInt(id) : id
  }

  // Filtrar amigos que no están en el chat
  const amigosDisponibles = Array.isArray(amigos)
    ? amigos.filter((amigo) => {
        const amigoId = normalizeId(amigo.id_usuario)
        const estaEnChat = usuarios.some((usuario) => normalizeId(usuario.id_usuario) === amigoId)

        return !estaEnChat
      })
    : []

  // Filtrar usuarios que no están en el chat y no son amigos
  const usuariosDisponibles = Array.isArray(todosUsuarios)
    ? todosUsuarios.filter((usuario) => {
        const usuarioId = normalizeId(usuario.id_usuario)
        const currentUserIdNorm = normalizeId(userId)

        const esUsuarioActual = usuarioId === currentUserIdNorm
        const estaEnChat = usuarios.some((chatUser) => normalizeId(chatUser.id_usuario) === usuarioId)
        const esAmigo = Array.isArray(amigos) && amigos.some((amigo) => normalizeId(amigo.id_usuario) === usuarioId)

        return !esUsuarioActual && !estaEnChat && !esAmigo
      })
    : []

  const displayData = chatInfo || currentChat

  if (!displayData) {
    return (
      <div className="chat-info-container">
        <div className="chat-info-error">
          <h2>No hay chat seleccionado</h2>
        </div>
      </div>
    )
  }

  const isAdmin =
    userId && displayData.user_admin && Number.parseInt(userId) === Number.parseInt(displayData.user_admin)

  return (
    <div className="chat-info-container">
      <div className="chat-info-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft className="back-icon" />
          Volver al chat
        </button>
      </div>

      <div className="chat-info-content">
        <div className="chat-details">
          <h1 className="chat-title">{displayData.nombre}</h1>

          <div className="chat-description">
            <h3>Descripción</h3>
            <p>{displayData.descripcion || "Sin descripción disponible"}</p>
          </div>

          {(displayData.nombre_juego || displayData.id_juego) && (
            <div className="chat-game">
              <h3>
                <Gamepad2 className="game-icon" />
                Juego
              </h3>
              <p>{displayData.nombre_juego || `Juego ID: ${displayData.id_juego}`}</p>
            </div>
          )}

          <div className="chat-type">
            <h3>
              {displayData.comunidad ? <Globe className="type-icon" /> : <Lock className="type-icon" />}
              Tipo de chat
            </h3>
            <p>{displayData.comunidad ? "Comunidad pública" : "Chat privado"}</p>
          </div>

          {displayData.user_admin && (
            <div className="chat-admin">
              <h3>
                <Crown className="admin-icon" />
                Administrador
              </h3>
              <p>{displayData.nombre_usuario || `Admin ID: ${displayData.user_admin}`}</p>
            </div>
          )}
        </div>

        <div className="chat-participants">
          <h3>
            <Users className="users-icon" />
            Participantes ({usuarios.length})
          </h3>

          {loading ? (
            <div className="loading-participants">
              <p>Cargando participantes...</p>
            </div>
          ) : error ? (
            <div className="error-participants">
              <p>{error}</p>
            </div>
          ) : usuarios.length > 0 ? (
            <div className="participants-list">
              {usuarios.map((usuario, index) => (
                <div key={index} className="participant-item">
                  <div className="participant-info">
                    <span className="participant-name">{usuario.nombre_usuario}</span>
                    <div className="participant-date">
                      <Calendar className="calendar-icon" />
                      <span>Se unió el {formatDate(usuario.fecha_union)}</span>
                    </div>
                  </div>
                  {isAdmin && Number.parseInt(usuario.id_usuario) !== Number.parseInt(userId) && (
                    <button
                      onClick={() => handleExpulsarUsuario(usuario.id_usuario)}
                      className="kick-user-button"
                      title="Expulsar usuario"
                    >
                      <UserMinus className="kick-user-icon" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-participants">
              <p>No se encontraron participantes</p>
            </div>
          )}

          {isAdmin && (
            <div className="add-users-section">
              <h4>Añadir usuarios al chat</h4>

              {/* Tabs para alternar entre amigos y todos los usuarios */}
              <div className="user-tabs">
                <button
                  className={activeTab === "amigos" ? "user-tab active" : "user-tab"}
                  onClick={() => setActiveTab("amigos")}
                >
                  Amigos ({amigosDisponibles.length})
                </button>
                <button
                  className={activeTab === "usuarios" ? "user-tab active" : "user-tab"}
                  onClick={() => setActiveTab("usuarios")}
                >
                  Otros usuarios ({usuariosDisponibles.length})
                </button>
              </div>

              <div className="available-users-list">
                {activeTab === "amigos" ? (
                  amigosDisponibles.length > 0 ? (
                    amigosDisponibles.map((amigo, index) => (
                      <div key={index} className="available-user-item">
                        <div className="user-info">
                          <img
                            src={amigo.avatar || "/placeholder.svg?height=40&width=40"}
                            alt="Avatar"
                            className="user-avatar"
                            referrerPolicy="no-referrer"
                          />
                          <div className="user-details">
                            <span className="user-name">{amigo.nombre_usuario}</span>
                            <span className="user-email">{amigo.email}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAñadirUsuario(amigo.id_usuario)}
                          disabled={addingUser}
                          className="add-friend-button"
                          title="Añadir amigo al chat"
                        >
                          <UserPlus className="add-user-icon" />
                          Añadir
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-users-available">
                      <p>Todos tus amigos ya están en este chat</p>
                    </div>
                  )
                ) : usuariosDisponibles.length > 0 ? (
                  usuariosDisponibles.map((usuario, index) => (
                    <div key={index} className="available-user-item">
                      <div className="user-info">
                        <img
                          src={usuario.avatar || "/placeholder.svg?height=40&width=40"}
                          alt="Avatar"
                          className="user-avatar"
                          referrerPolicy="no-referrer"
                        />
                        <div className="user-details">
                          <span className="user-name">{usuario.nombre_usuario}</span>
                          <span className="user-email">{usuario.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAñadirUsuario(usuario.id_usuario)}
                        disabled={addingUser}
                        className="add-user-button"
                        title="Añadir usuario al chat"
                      >
                        <UserPlus className="add-user-icon" />
                        Añadir
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-users-available">
                    <p>No hay más usuarios disponibles</p>
                  </div>
                )}
              </div>

              {addUserError && <p className="error-message">{addUserError}</p>}
            </div>
          )}

          <div className="leave-chat-section">
            <button onClick={handleAbandonarChat} className="leave-chat-button" disabled={abandonandoChat}>
              <LogOut className="leave-icon" />
              {abandonandoChat ? "Abandonando..." : "Abandonar Chat"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInfo
