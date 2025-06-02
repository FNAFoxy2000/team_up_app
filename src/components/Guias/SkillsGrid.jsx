import React, { useState, useEffect } from 'react';
import styles from './niveles.module.css';

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
    <div className={styles.skillGridContainer}>
      <div className={styles.skillGrid}>
        <div className={styles.skillGridHeader}>
          <div className={styles.skillGridCorner}></div>
          {Array.from({ length: niveles }).map((_, i) => (
            <div key={i} className={styles.skillGridHeaderCell}>
              {i + 1}
            </div>
          ))}
        </div>

        {habilidades.map(hab => (
          <div key={hab} className={styles.skillGridRow}>
            <div className={styles.skillGridRowLabel}>{hab}</div>
            {Array.from({ length: niveles }).map((_, nivel) => {
              const activo = seleccion[nivel] === hab;
              const isNivelR = nivelesR.includes(nivel + 1);
              let disabled = false;

              if (hab === 'R' && !esUdyr && !isNivelR) disabled = true;
              else if (!puedeAsignar(nivel, hab) && !activo) disabled = true;

              return (
                <div
                  key={nivel}
                  className={`${styles.skillGridCell} ${
                    activo ? styles.active : ''
                  } ${disabled ? styles.disabled : ''}`}
                  onClick={() => !disabled && handleSelect(nivel, hab)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <p className={styles.restriccionesTexto}>
        Restricciones:
        {esUdyr ? (
          <> Udyr puede subir su R como cualquier otra habilidad hasta 5 veces.</>
        ) : (
          <> Máximo 5 puntos en Q/W/E, 3 en R (solo niveles 6, 11, 16).</>
        )}
      </p>
    </div>
  );
};

export default SkillLevelGrid;