"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllJuegos } from "../peticiones/juego_peticiones.mjs"
import { createChat } from "../peticiones/chat_peticiones.mjs"
import AuthService from "../services/authService.mjs"
import { getUserIdByEmail } from "../peticiones/usuario_peticiones.mjs"
import "./CrearChat.css"

const CrearChat = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    id_juego: "",
    esComunidad: false,
  })
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingJuegos, setLoadingJuegos] = useState(true)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()

  // Cargar juegos y obtener información del usuario al montar el componente
  useEffect(() => {
    const initializeData = async () => {
      try {
        const userData = AuthService.getUserFromToken()
        if (userData && userData.email) {
          const id = await getUserIdByEmail(userData.email)
          setUserId(id)
        } else {
          navigate("/NoLogin")
          return
        }

        setLoadingJuegos(true)
        const juegosData = await getAllJuegos()
        setJuegos(juegosData)
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
        setError("Error al cargar los juegos disponibles")
      } finally {
        setLoadingJuegos(false)
      }
    }

    initializeData()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("El nombre del chat es obligatorio")
      return
    }

    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria")
      return
    }

    if (!userId) {
      setError("Error: No se pudo obtener la información del usuario")
      return
    }

    setLoading(true)

    try {
      const chatData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        id_juego: formData.id_juego || null,
        id_usuario: userId,
        comunidad: formData.esComunidad ? 1 : 0,
      }

      // console.log("Datos del chat a crear:", chatData)
      const result = await createChat(chatData)
      // console.log("Chat creado:", result)

      // Redirigir de vuelta al chat
      navigate("/chat")
    } catch (error) {
      console.error("Error al crear el chat:", error)

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError("Error al crear el chat. Por favor, intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/chat")
  }

  // Mostrar loading mientras se cargan los juegos
  if (loadingJuegos) {
    return (
      <div className="crear-chat-page">
        <div className="loading">Cargando juegos disponibles...</div>
      </div>
    )
  }

  return (
    <div className="crear-chat-page">
      <div className="crear-chat-container">
        <div className="crear-chat-header">
          <h1>Crear Nuevo Chat</h1>
          <button onClick={handleCancel} className="close-button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="crear-chat-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre del chat *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre del chat"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe de qué trata este chat"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_juego">Juego (opcional)</label>
            <select id="id_juego" name="id_juego" value={formData.id_juego} onChange={handleInputChange}>
              <option value="">Selecciona un juego (opcional)</option>
              {juegos.map((juego) => (
                <option key={juego.id_juego} value={juego.id_juego}>
                  {juego.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="esComunidad" checked={formData.esComunidad} onChange={handleInputChange} />
              <span className="checkbox-text">Es una comunidad</span>
            </label>
            <small className="help-text">Las comunidades son chats públicos que cualquier usuario puede unirse</small>
          </div>

          <div className="form-actions">
            <span className="button-wrapper">
              <button type="button" onClick={handleCancel} className="cancel-button" disabled={loading}>
                Cancelar
              </button>
            </span>
            <span className="button-wrapper">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Creando..." : "Crear Chat"}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CrearChat
