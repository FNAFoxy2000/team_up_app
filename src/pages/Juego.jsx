"use client";
import React, { useEffect, useState } from "react";
import "./Juego.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getDatosJuego,
  borrarJuego
} from "../peticiones/juego_peticiones.mjs";
import {
  getChatsJuego
} from "../peticiones/juego_peticiones.mjs";
import {
  getUserChats,
  abandonarChat,
  unirseChat
} from "../peticiones/chat_peticiones.mjs";
import {
  getUsuarioPorJuego,
  eliminarJuegoDeUsuario,
  insertarJuegoDeUsuario
} from "../peticiones/usuarios-juegos_peticiones.mjs";
import { getUserIdByEmail } from "../peticiones/usuario_peticiones.mjs";
import AuthService from "../services/authService";
import { showSuccess, showError } from '../components/Toast';

const GameProfilePage = () => {
  const { nombreJuego } = useParams();
  const nombreParseado = nombreJuego.replaceAll("_", " ");
  const [juego, setJuego] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [datosUsuarioJuego, setDatosUsuarioJuego] = useState(null);
  const [rangoSeleccionado, setRangoSeleccionado] = useState("");
  const [infoExtra, setInfoExtra] = useState("");
  const [chatsJuego, setChatsJuego] = useState([]);
  const [chatsUsuario, setChatsUsuario] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = !!usuario;
  const isAdmin = isLoggedIn && usuario.is_admin === true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const juegoData = await getDatosJuego(nombreParseado);
        setJuego(juegoData);

        const userFromToken = AuthService.getUserFromToken();
        if (userFromToken) {
          setUsuario(userFromToken);
          const id = await getUserIdByEmail(userFromToken.email);
          setUserId(id);

          const datos = await getUsuarioPorJuego(juegoData.id_juego, userFromToken.id_usuario);
          if (datos.success && datos.data) {
            setFavorito(true);
            setDatosUsuarioJuego(datos.data);

            if (datos.data.datos_extra_juego) {
              try {
                const extra = JSON.parse(datos.data.datos_extra_juego);
                setRangoSeleccionado(extra.rango || '');
                setInfoExtra(extra.info_extra || '');
              } catch (parseError) {
                console.error("Error al parsear datos_extra_juego:", parseError);
              }
            }
          }

          if (juegoData.id_juego) {
            await fetchChatsData(juegoData.id_juego, id);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [nombreParseado]);

  const fetchChatsData = async (idJuego, idUsuario) => {
    try {
      setLoadingChats(true);
      const chats = await getChatsJuego(idJuego);
      const chatsDelUsuario = await getUserChats(idUsuario);
      setChatsJuego(chats);
      setChatsUsuario(chatsDelUsuario);
    } catch (error) {
      console.error("Error al obtener chats:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleBorrarJuego = async () => {
    const confirmacion = window.confirm(`¿Estás seguro de que quieres borrar "${juego.nombre}"?`);
    if (confirmacion) {
      try {
        await borrarJuego(juego);
        showSuccess("Juego borrado correctamente");
        navigate("/");
      } catch (error) {
        console.error("Error al borrar el juego:", error);
        showError("Error al borrar el juego");
      }
    }
  };

  const handleAgregarFavorito = async () => {
    const gameTag = prompt("Introduce tu game tag:");
    if (!gameTag) return;

    try {
      await insertarJuegoDeUsuario(usuario.id_usuario, juego.id_juego, gameTag, null);
      setFavorito(true);
      setDatosUsuarioJuego({
        usuario_id: usuario.id_usuario,
        juego_id: juego.id_juego,
        game_tag: gameTag,
        datos_extra_juego: null
      });
    } catch (err) {
      console.error("Error al marcar como favorito:", err);
      showError("No se pudo marcar como favorito.");
    }
  };

  const handleQuitarFavorito = async () => {
    try {
      await eliminarJuegoDeUsuario(usuario.id_usuario, juego.id_juego);
      setFavorito(false);
      setDatosUsuarioJuego(null);
      setRangoSeleccionado("");
      setInfoExtra("");
    } catch (err) {
      console.error("Error al quitar favorito:", err);
      showError("No se pudo quitar de favoritos.");
    }
  };

  const handleRangoChange = async (e) => {
    const nuevoRango = e.target.value;
    setRangoSeleccionado(nuevoRango);

    if (datosUsuarioJuego?.game_tag) {
      try {
        await insertarJuegoDeUsuario(
          usuario.id_usuario,
          juego.id_juego,
          datosUsuarioJuego.game_tag,
          {
            rango: nuevoRango,
            info_extra: infoExtra
          }
        );
      } catch (err) {
        console.error("Error al actualizar el rango:", err);
      }
    }
  };

  const handleGuardarInfoExtra = async () => {
    if (datosUsuarioJuego?.game_tag) {
      try {
        await insertarJuegoDeUsuario(
          usuario.id_usuario,
          juego.id_juego,
          datosUsuarioJuego.game_tag,
          {
            rango: rangoSeleccionado,
            info_extra: infoExtra
          }
        );
        showSuccess("Información extra actualizada.");
      } catch (err) {
        console.error("Error al actualizar info extra:", err);
        showError("No se pudo guardar la información extra.");
      }
    }
  };

  const handleUnirseChat = async (chatId) => {
    try {
      const response = await unirseChat(userId, chatId);
      if (response.success) {
        await fetchChatsData(juego.id_juego, userId);
      }
    } catch (error) {
      console.error("Error al unirse al chat:", error);
      showError("Error al unirse al chat");
    }
  };

  const handleAbandonarChat = async (chatId, chatNombre) => {
    const confirmacion = window.confirm(`¿Estás seguro de que quieres abandonar el chat "${chatNombre}"?`);
    if (confirmacion) {
      try {
        const response = await abandonarChat(userId, chatId);
        if (response.success) {
          await fetchChatsData(juego.id_juego, userId);
        }
      } catch (error) {
        console.error("Error al abandonar el chat:", error);
        showError("Error al abandonar el chat");
      }
    }
  };

  const isUserInChat = (chatId) => {
    return chatsUsuario.some((chat) => chat.id_chat === chatId);
  };

  if (!juego) {
    return (
      <div style={{ padding: "120px 20px", color: "#f5f5f5" }}>
        <h2>Juego no Encontrado</h2>
      </div>
    );
  }

  return (
    <div className="game-profile">
      <div className="header">
        <img src={juego.banner || "/placeholder.svg"} alt={`${juego.nombre} Banner`} className="header-image" />
      </div>

      <div className="profile-info">
        <img src={juego.foto_juego || "/placeholder.svg"} alt={`${juego.nombre} Logo`} className="profile-avatar" />
        <h1 className="game-name">{juego.nombre}</h1>
        <p className="game-description">{juego.descripcion}</p>

        {!isAdmin && isLoggedIn && (
          <div style={{ marginTop: "10px" }}>
            {!favorito ? (
              <button className="btn-primary" onClick={handleAgregarFavorito}>Marcar como Favorito</button>
            ) : (
              <button className="btn-secondary" onClick={handleQuitarFavorito}>Quitar de Favoritos</button>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="cta-buttons">
            <Link to="/juegos/editar" state={{ juego }} className="btn-primary">Editar Juego</Link>
            <button onClick={handleBorrarJuego} className="btn-secondary">Borrar Juego</button>
          </div>
        )}

        <div className="extra-info">
          {!isLoggedIn && (
            <p className="registro-info">
              <strong>¿Te gusta este juego?</strong> Regístrate para poder marcarlo como favorito y personalizar tu perfil.
            </p>
          )}

          <p><strong>Género:</strong> {juego.categoria}</p>
          <p><strong>Disponible en:</strong> {juego.dispositivos}</p>

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

          {favorito && (
            <div className="rango-selector-wrapper">
              <label htmlFor="rango-select"><strong>Selecciona tu rango: </strong></label>
              <select
                id="rango-select"
                value={rangoSeleccionado}
                onChange={handleRangoChange}
                className="rango-select"
              >
                <option value="">-- Elige un rango --</option>
                {juego.rangos.map((rango, index) => (
                  <option key={index} value={rango.nombre}>{rango.nombre}</option>
                ))}
              </select>

              <div style={{ marginTop: "15px" }}>
                <label htmlFor="info-extra"><strong>Información adicional:</strong></label>
                <textarea
                  id="info-extra"
                  className="info-extra-textarea"
                  value={infoExtra}
                  onChange={(e) => setInfoExtra(e.target.value)}
                  rows="4"
                  style={{ width: "100%", marginTop: "5px" }}
                />
                <button className="btn-primary" onClick={handleGuardarInfoExtra} style={{ marginTop: "10px" }}>
                  Guardar información extra
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <div className="chats-juego-section">
            <h3>Chats de {juego.nombre}</h3>

            {loadingChats ? (
              <p>Cargando chats...</p>
            ) : chatsJuego.length > 0 ? (
              <div className="chats-grid">
                {chatsJuego.map((chat) => (
                  <div key={chat.id_chat} className="chat-card">
                    <div className="chat-info">
                      <h4 className="chat-nombre">{chat.nombre}</h4>
                      <p className="chat-descripcion">{chat.descripcion}</p>
                    </div>
                    <div className="chat-actions">
                      {isUserInChat(chat.id_chat) ? (
                        <button onClick={() => handleAbandonarChat(chat.id_chat, chat.nombre)} className="btn-abandonar">
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
              <p>No hay chats disponibles para este juego.</p>
            )}

            <div className="crear-comunidad-section">
              <Link to="/crearChat" className="btn-crear-comunidad">Crear Comunidad</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GameProfilePage;
