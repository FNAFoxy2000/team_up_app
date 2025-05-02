import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Juego.css';
import { getDatosJuego } from '../peticiones/juego_peticiones.mjs';
import { useParams } from 'react-router-dom';

const GameProfilePage = () => {
  const { nombreJuego } = useParams();
  const nombreParseado = nombreJuego.replaceAll('_', ' ');
  const [juego, setJuego] = useState(null);
  const [rangoSeleccionado, setRangoSeleccionado] = useState('');

  useEffect(() => {

    const fetchJuego = async () => {
      const data = await getDatosJuego(nombreParseado);
      setJuego(data);
    };
    fetchJuego();
  }, [nombreParseado]);

  const handleRangoChange = (e) => {
    setRangoSeleccionado(e.target.value);
  };

  if (!juego) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '120px 20px', color: '#f5f5f5' }}>
          <h2>Juego no Encontrado</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="game-profile">
        <div className="header">
          <img
            src={juego.banner}
            alt={`${juego.nombre} Banner`}
            className="header-image"
          />
        </div>

        <div className="profile-info">
          <img
            src={juego.foto_juego}
            alt={`${juego.nombre} Logo`}
            className="profile-avatar"
          />
          <h1 className="game-name">{juego.nombre}</h1>
          <p className="game-description">{juego.descripcion}</p>

          <div className="extra-info">
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

            <div className="rango-selector-wrapper">
              <label htmlFor="rango-select"><strong>Selecciona tu rango:   </strong></label>
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
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GameProfilePage;
