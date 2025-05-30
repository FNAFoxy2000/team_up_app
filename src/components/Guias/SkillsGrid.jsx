import React, { useState, useEffect } from 'react';
import './guias.css';

const habilidades = ['Q', 'W', 'E', 'R'];
const niveles = 18;
const nivelesR = [6, 11, 16];

const SkillLevelGrid = ({ onChange, campeonNombre }) => {
  const [seleccion, setSeleccion] = useState(Array(niveles).fill(null));
  const nivelCampeon = 18;
  const esUdyr = campeonNombre?.toLowerCase() === 'udyr';

  const contarPuntos = () => {
    const conteo = { Q: 0, W: 0, E: 0, R: 0 };
    seleccion.forEach(hab => {
      if (hab) conteo[hab]++;
    });
    return conteo;
  };

  const puedeAsignar = (nivel, hab) => {
    const puntos = contarPuntos();
    const nivelReal = nivel + 1;

    if (hab === 'R' && !esUdyr) {
      if (!nivelesR.includes(nivelReal)) return false;
      if (puntos.R >= 3 && seleccion[nivel] !== 'R') return false;
    } else {
      if (puntos[hab] >= 5 && seleccion[nivel] !== hab) return false;
      if (puntos[hab] >= Math.floor((nivelCampeon + 1) / 2) && seleccion[nivel] !== hab) return false;
    }

    return true;
  };

  const handleSelect = (nivel, hab) => {
    if (seleccion[nivel] === hab) {
      const newSel = [...seleccion];
      newSel[nivel] = null;
      setSeleccion(newSel);
      return;
    }

    if (!puedeAsignar(nivel, hab)) return;

    const newSel = [...seleccion];
    newSel[nivel] = hab;
    setSeleccion(newSel);
  };

  useEffect(() => {
    if (onChange) {
      onChange(seleccion);
    }
  }, [seleccion, onChange]);

  return (
    <div className="skill-grid-container">
      <h3 style={{ color: 'white', textAlign: 'center' }}>Nivel 18</h3>

      <div className="skill-grid">
        <div className="skill-grid-header">
          <div className="skill-grid-corner"></div>
          {Array.from({ length: niveles }).map((_, i) => (
            <div key={i} className="skill-grid-header-cell">
              {i + 1}
            </div>
          ))}
        </div>

        {habilidades.map(hab => (
          <div key={hab} className="skill-grid-row">
            <div className="skill-grid-row-label">{hab}</div>
            {Array.from({ length: niveles }).map((_, nivel) => {
              const activo = seleccion[nivel] === hab;
              const isNivelR = nivelesR.includes(nivel + 1);
              let disabled = false;

              if (hab === 'R' && !esUdyr && !isNivelR) disabled = true;
              else if (!puedeAsignar(nivel, hab) && !activo) disabled = true;

              return (
                <div
                  key={nivel}
                  className={`skill-grid-cell ${activo ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                  onClick={() => !disabled && handleSelect(nivel, hab)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ color: 'white', marginTop: '1rem' }}>
        Restricciones:
        {esUdyr ? (
          <> Udyr puede subir su R como cualquier otra habilidad hasta 5 veces.</>
        ) : (
          <> Máximo 5 puntos en Q/W/E, 3 en R (solo niveles 6, 11, 16).</>
        )}
      </p>

      <pre style={{ color: 'white', marginTop: '1rem', fontSize: '0.9rem' }}>
        {JSON.stringify(seleccion, null, 2)}
      </pre>
    </div>
  );
};

export default SkillLevelGrid;