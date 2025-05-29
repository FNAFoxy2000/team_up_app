import React, { useState, useEffect } from 'react';
import './guias.css';

const habilidades = ['Q', 'W', 'E', 'R'];
const niveles = 18;
const nivelesR = [6, 11, 16];

const SkillLevelGrid = ({ onChange }) => {
  const [seleccion, setSeleccion] = useState(Array(niveles).fill(null));
  const [nivelCampeon, setNivelCampeon] = useState(1);

  // Cuenta cuántos puntos hay en cada habilidad
  const contarPuntos = () => {
    const conteo = { Q: 0, W: 0, E: 0, R: 0 };
    seleccion.forEach(hab => {
      if (hab) conteo[hab]++;
    });
    return conteo;
  };

  // Comprueba si se puede asignar la habilidad en ese nivel
  const puedeAsignar = (nivel, hab) => {
    const puntos = contarPuntos();
    const nivelReal = nivel + 1; // base 1

    if (hab === 'R') {
      // Ultimate reglas
      if (!nivelesR.includes(nivelReal)) return false; // solo en niveles 6, 11, 16
      if (puntos.R >= 3 && seleccion[nivel] !== 'R') return false; // máximo 3 puntos en R
      if (nivelCampeon < 6) return false; // no se puede antes nivel 6
      if (puntos.R >= Math.floor(nivelCampeon / 5) && seleccion[nivel] !== 'R') return false;
    } else {
      // Habilidades normales
      if (puntos[hab] >= 5 && seleccion[nivel] !== hab) return false; // máximo 5 puntos por habilidad
      // No se puede subir más de nivel permitido
      // máximo puntos en habilidad normal <= floor((nivelCampeon +1)/2)
      if (puntos[hab] >= Math.floor((nivelCampeon + 1) / 2) && seleccion[nivel] !== hab) return false;
      // No se puede asignar R en niveles ultimate, no bloqueamos Q/W/E en esos niveles para mayor flexibilidad
    }

    return true;
  };

  const handleSelect = (nivel, hab) => {
    // Si ya está seleccionado esa habilidad en ese nivel, deselecciona
    if (seleccion[nivel] === hab) {
      const newSel = [...seleccion];
      newSel[nivel] = null;
      setSeleccion(newSel);
      return;
    }

    if (!puedeAsignar(nivel, hab)) {
      // No permitido, ignora
      return;
    }

    // Si ya hay otra habilidad seleccionada en ese nivel, la reemplazamos
    const newSel = [...seleccion];
    newSel[nivel] = hab;
    setSeleccion(newSel);
  };

  // Cuando cambia la selección o el nivel del campeón, avisamos con el JSON (array) del orden
  useEffect(() => {
    if (onChange) {
      onChange(seleccion);
    }
  }, [seleccion, nivelCampeon, onChange]);

  return (
    <div className="skill-grid-container">
      <div style={{ marginBottom: 15, color: 'white', textAlign: 'center' }}>
        <label>
          Nivel del campeón: &nbsp;
          <input
            type="number"
            min="1"
            max="18"
            value={nivelCampeon}
            onChange={e => {
              let val = Number(e.target.value);
              if (val < 1) val = 1;
              if (val > 18) val = 18;
              setNivelCampeon(val);
            }}
            style={{ width: 50, textAlign: 'center' }}
          />
        </label>
      </div>

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

              // Validamos si la celda está habilitada
              let disabled = false;

              if (hab === 'R' && !isNivelR) disabled = true;
              else if (!puedeAsignar(nivel, hab) && !activo) disabled = true;

              return (
                <div
                  key={nivel}
                  className={`skill-grid-cell ${activo ? 'active' : ''} ${
                    disabled ? 'disabled' : ''
                  }`}
                  onClick={() => !disabled && handleSelect(nivel, hab)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ color: 'white', marginTop: '1rem' }}>
        Nivel del campeón: {nivelCampeon}. <br />
        Restricciones: Máximo 5 puntos en habilidades normales, máximo 3 en R. R sólo en niveles 6, 11 y 16. <br />
        Las habilidades se desbloquean según el nivel del campeón.
      </p>

      <pre style={{ color: 'white', marginTop: '1rem', fontSize: '0.9rem' }}>
        {JSON.stringify(seleccion, null, 2)}
      </pre>
    </div>
  );
};

export default SkillLevelGrid;