"use client"

import { useEffect, useState } from "react"
import "./Juego.css"
import { getDatosJuego, borrarJuego, getChatsJuego } from "../peticiones/juego_peticiones.mjs"
import { getUserChats, abandonarChat } from "../peticiones/chat_peticiones.mjs"
import AuthService from "../services/authService.mjs"
import { getUserIdByEmail } from "../peticiones/usuario_peticiones.mjs"
import { Link, useParams, useNavigate } from "react-router-dom"

const GameProfilePage = () => {
  const { nombreJuego } = useParams()
  const nombreParseado = nombreJuego.replaceAll("_", " ")
  const [juego, setJuego] = useState(null)
  const [chatsJuego, setChatsJuego] = useState([])
  const [chatsUsuario, setChatsUsuario] = useState([])
  const [loadingChats, setLoadingChats] = useState(false)
  const [userId, setUserId] = useState(null)
  const [rangoSeleccionado, setRangoSeleccionado] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Obtener información del usuario
        const userData = AuthService.getUserFromToken()
        if (userData && userData.email) {
          const id = await getUserIdByEmail(userData.email)
          setUserId(id)

          // Obtener datos del juego
          const data = await getDatosJuego(nombreParseado)
          setJuego(data)

          // Una vez que tenemos los datos del juego y el usuario, obtenemos los chats
          if (data && data.id_juego) {
            await fetchChatsData(data.id_juego, id)
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error)
      }
    }
    initializeData()
  }, [nombreParseado])

  const fetchChatsData = async (idJuego, idUsuario) => {
    try {
      setLoadingChats(true)
      console.log("Obteniendo chats para el juego:", idJuego, "y usuario:", idUsuario)

      // Obtener chats del juego
      const chats = await getChatsJuego(idJuego)
      setChatsJuego(chats)

      // Obtener chats donde ya pertenece el usuario
      const chatsDelUsuario = await getUserChats(idUsuario)
      setChatsUsuario(chatsDelUsuario)
    } catch (error) {
      console.error("Error al obtener chats:", error)
      setChatsJuego([])
      setChatsUsuario([])
    } finally {
      setLoadingChats(false)
    }
  }

  const handleRangoChange = (e) => {
    setRangoSeleccionado(e.target.value)
  }

  const handleBorrarJuego = async () => {
    const confirmacion = window.confirm(`¿Estás seguro de que quieres borrar "${juego.nombre}"?`)
    if (confirmacion) {
      try {
        await borrarJuego(juego)
        alert("Juego borrado correctamente")
        navigate("/")
      } catch (error) {
        console.error("Error al borrar el juego:", error)
        alert("Error al borrar el juego")
      }
    }
  }

  const handleUnirseChat = (chatId) => {
    // Redirigir al chat específico
    navigate(`/chat?chatId=${chatId}`)
  }

  const handleAbandonarChat = async (chatId, chatNombre) => {
    const confirmacion = window.confirm(`¿Estás seguro de que quieres abandonar el chat "${chatNombre}"?`)
    if (confirmacion) {
      try {
        // Aquí harías la petición para abandonar el chat
        console.log(`Abandonando chat ${chatId}`)
        const response = await abandonarChat(userId, chatId)
        if (response.success) {
          console.log("Abandonado correctamente el chat:", chatId)

          // Actualizar la lista de chats del usuario después de abandonar
          if (juego && juego.id_juego && userId) {
            await fetchChatsData(juego.id_juego, userId)
          }
        }

      } catch (error) {
        console.error("Error al abandonar el chat:", error)
        alert("Error al abandonar el chat")
      }
    }
  }

  const isUserInChat = (chatId) => {
    return chatsUsuario.some((chat) => chat.id_chat === chatId)
  }

  if (!juego) {
    return (
      <>
        <div style={{ padding: "120px 20px", color: "#f5f5f5" }}>
          <h2>Juego no Encontrado</h2>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="game-profile">
        <div className="header">
          <img src={juego.banner || "/placeholder.svg"} alt={`${juego.nombre} Banner`} className="header-image" />
        </div>

        <div className="profile-info">
          <img src={juego.foto_juego || "/placeholder.svg"} alt={`${juego.nombre} Logo`} className="profile-avatar" />
          <h1 className="game-name">{juego.nombre}</h1>
          <p className="game-description">{juego.descripcion}</p>

          <div className="cta-buttons">
            <Link to="/juegos/editar" state={{ juego }} className="btn-primary">
              Editar Juego
            </Link>

            <button onClick={handleBorrarJuego} className="btn-secondary">
              Borrar Juego
            </button>
          </div>

          <div className="extra-info">
            <p>
              <strong>Género:</strong> {juego.categoria}
            </p>
            <p>
              <strong>Disponible en:</strong> {juego.dispositivos}
            </p>

            <div className="rangos-visual">
              <h3>Rangos del juego</h3>
              <div className="rango-grid">
                {juego.rangos.map((rango, index) => (
                  <div key={index} className="rango-card">
                    <h4>{rango.nombre}</h4>
                    <p>{rango.puntos}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rango-selector-wrapper">
              <label htmlFor="rango-select">
                <strong>Selecciona tu rango: </strong>
              </label>
              <select id="rango-select" value={rangoSeleccionado} onChange={handleRangoChange} className="rango-select">
                <option value="">-- Elige un rango --</option>
                {juego.rangos.map((rango, index) => (
                  <option key={index} value={rango.nombre}>
                    {rango.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sección de chats del juego */}
          <div className="chats-juego-section">
            <h3>Chats de {juego.nombre}</h3>

            {loadingChats ? (
              <div className="loading-chats">
                <p>Cargando chats...</p>
              </div>
            ) : (
              <>
                {chatsJuego.length > 0 ? (
                  <div className="chats-grid">
                    {chatsJuego.map((chat) => (
                      <div key={chat.id_chat} className="chat-card">
                        <div className="chat-info">
                          <h4 className="chat-nombre">{chat.nombre}</h4>
                          <p className="chat-descripcion">{chat.descripcion}</p>
                        </div>
                        <div className="chat-actions">
                          {isUserInChat(chat.id_chat) ? (
                            <button
                              onClick={() => handleAbandonarChat(chat.id_chat, chat.nombre)}
                              className="btn-abandonar"
                            >
                              Abandonar Chat
                            </button>
                          ) : (
                            <button onClick={() => handleUnirseChat(chat.id_chat)} className="btn-unirse">
                              Unirse
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-chats">
                    <p>No hay chats disponibles para este juego.</p>
                  </div>
                )}

                {/* Botón de crear comunidad - siempre visible */}
                <div className="crear-comunidad-section">
                  <Link to="/crearChat" className="btn-crear-comunidad">
                    Crear Comunidad
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default GameProfilePage
