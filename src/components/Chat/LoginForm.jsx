"use client"

import { useState } from "react"

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username.trim() || !userId.trim()) {
      setError("Por favor, completa todos los campos")
      return
    }

    onLogin(username, userId)
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar sesión en el chat</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">ID de Usuario:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ingresa tu ID de usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <button type="submit" className="login-button">
            Entrar al Chat
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
