"use client"

import { useState, useEffect } from "react"
import { getChatUsers, getInfoChat, abandonarChat, unirseChat } from "../../peticiones/chat_peticiones.mjs"
import { getUserIdByEmail } from "../../peticiones/usuario_peticiones"
import { ArrowLeft, Users, Calendar, Gamepad2, Crown, Globe, Lock, UserMinus, UserPlus } from "lucide-react"

const ChatInfo = ({ currentChat, onBack, userId }) => {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [chatInfo, setChatInfo] = useState(null)

    const [newUserEmail, setNewUserEmail] = useState("")
    const [addingUser, setAddingUser] = useState(false)
    const [addUserError, setAddUserError] = useState("")

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
                console.log("Usuarios del chat:", usersData)
                setUsuarios(usersData)
            } catch (error) {
                console.error("Error al obtener información del chat:", error)
                setError("Error al cargar la información del chat")
            } finally {
                setLoading(false)
            }
        }

        fetchChatInfo()
    }, [currentChat])

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

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleAñadirUsuario = async (e) => {
        e.preventDefault()

        if (!validateEmail(newUserEmail)) {
            setAddUserError("Por favor, introduce un email válido")
            return
        }

        try {
            setAddingUser(true)
            setAddUserError("")

            // Obtener el ID del usuario por su email
            const id_usuario = await getUserIdByEmail(newUserEmail)

            // Añadir el usuario al chat
            await unirseChat(id_usuario, displayData.id_chat)

            // Recargar la lista de usuarios
            const usersData = await getChatUsers(displayData.id_chat)
            setUsuarios(usersData)

            // Limpiar el formulario
            setNewUserEmail("")
        } catch (error) {
            console.error("Error al añadir usuario:", error)
            setAddUserError("Error al añadir el usuario. Verifica que el email sea correcto.")
        } finally {
            setAddingUser(false)
        }
    }

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

    // Debug: mostrar toda la información del chat
    // console.log("Información completa del chat:", displayData)

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
                        <div className="add-user-form">
                            <h4>Añadir usuario</h4>
                            <form onSubmit={handleAñadirUsuario}>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        placeholder="Email del usuario"
                                        disabled={addingUser}
                                        className="email-input"
                                    />
                                    <button type="submit" disabled={addingUser || !newUserEmail.trim()} className="add-user-button">
                                        <UserPlus className="add-user-icon" />
                                        {addingUser ? "Añadiendo..." : "Añadir"}
                                    </button>
                                </div>
                                {addUserError && <p className="error-message">{addUserError}</p>}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatInfo
