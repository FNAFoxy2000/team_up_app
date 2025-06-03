import React, { useEffect, useState } from 'react';
import './Juego.css';
import { getDatosJuego, borrarJuego } from '../peticiones/juego_peticiones.mjs';
import {
  getUsuarioPorJuego,
  eliminarJuegoDeUsuario,
  insertarJuegoDeUsuario
} from '../peticiones/usuarios-juegos_peticiones.mjs';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const GameProfilePage = () => {
  const { nombreJuego } = useParams();
  const nombreParseado = nombreJuego.replaceAll('_', ' ');
  const [juego, setJuego] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [datosUsuarioJuego, setDatosUsuarioJuego] = useState(null);
  const [rangoSeleccionado, setRangoSeleccionado] = useState('');
  const [infoExtra, setInfoExtra] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const juegoData = await getDatosJuego(nombreParseado);
      setJuego(juegoData);

      const userFromToken = AuthService.getUserFromToken();
      if (userFromToken) {
        setUsuario(userFromToken);
        try {
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
        } catch (err) {
          console.error('No es favorito:', err);
        }
      }
    };

    fetchData();
  }, [nombreParseado]);

  const handleBorrarJuego = async () => {
    const confirmacion = window.confirm(`¿Estás seguro de que quieres borrar "${juego.nombre}"?`);
    if (confirmacion) {
      try {
        await borrarJuego(juego);
        alert("Juego borrado correctamente");
        navigate("/");
      } catch (error) {
        console.error("Error al borrar el juego:", error);
        alert("Error al borrar el juego");
      }
    }
  };

  const handleAgregarFavorito = async () => {
    const gameTag = prompt('Introduce tu game tag:');
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
      alert("No se pudo marcar como favorito.");
    }
  };

  const handleQuitarFavorito = async () => {
    try {
      await eliminarJuegoDeUsuario(usuario.id_usuario, juego.id_juego);
      setFavorito(false);
      setDatosUsuarioJuego(null);
      setRangoSeleccionado('');
      setInfoExtra('');
    } catch (err) {
      console.error("Error al quitar favorito:", err);
      alert("No se pudo quitar de favoritos.");
    }
  };

  const handleRangoChange = async (e) => {
    const nuevoRango = e.target.value;
    setRangoSeleccionado(nuevoRango);

    if (!datosUsuarioJuego || !datosUsuarioJuego.game_tag) {
      console.error("No se encontró el game_tag del usuario para este juego.");
      return;
    }

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
  };


  const handleGuardarInfoExtra = async () => {
    if (!datosUsuarioJuego || !datosUsuarioJuego.game_tag) {
      console.error("No se encontró el game_tag del usuario para este juego.");
      return;
    }

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
      alert("Información extra actualizada.");
    } catch (err) {
      console.error("Error al actualizar info extra:", err);
      alert("No se pudo guardar la información extra.");
    }
  };


  if (!juego) {
    return (
      <div style={{ padding: '120px 20px', color: '#f5f5f5' }}>
        <h2>Juego no Encontrado</h2>
      </div>
    );
  }

  const isLoggedIn = !!usuario;
  const isAdmin = isLoggedIn && usuario.is_admin === true;

  return (
    <div className="game-profile">
      <div className="header">
        <img src={juego.banner} alt={`${juego.nombre} Banner`} className="header-image" />
      </div>

      <div className="profile-info">
        <img src={juego.foto_juego} alt={`${juego.nombre} Logo`} className="profile-avatar" />
        <h1 className="game-name">{juego.nombre}</h1>
        <p className="game-description">{juego.descripcion}</p>

        {isLoggedIn && !isAdmin && (
          <div style={{ marginTop: '10px' }}>
            {!favorito ? (
              <button className="btn-primary" onClick={handleAgregarFavorito}>
                Marcar como Favorito
              </button>
            ) : (
              <button className="btn-secondary" onClick={handleQuitarFavorito}>
                Quitar de Favoritos
              </button>
            )}
          </div>
        )}

        <div className="cta-buttons">
          {isAdmin && (
            <>
              <Link to="/juegos/editar" state={{ juego }} className="btn-primary">
                Editar Juego
              </Link>
              <button onClick={handleBorrarJuego} className="btn-secondary">
                Borrar Juego
              </button>
            </>
          )}
        </div>

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
                  <option key={index} value={rango.nombre}>
                    {rango.nombre}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: '15px' }}>
                <label htmlFor="info-extra"><strong>Información adicional:</strong></label>
                <textarea
                  id="info-extra"
                  className="info-extra-textarea"
                  value={infoExtra}
                  onChange={(e) => setInfoExtra(e.target.value)}
                  rows="4"
                  style={{ width: '100%', marginTop: '5px' }}
                />
                <button className="btn-primary" onClick={handleGuardarInfoExtra} style={{ marginTop: '10px' }}>
                  Guardar información extra
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameProfilePage;
