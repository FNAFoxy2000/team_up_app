import React, { useState, useEffect } from 'react';
import styles from './niveles.module.css';

const habilidades = ['Q', 'W', 'E', 'R'];
const niveles = 18;
const nivelesR = [6, 11, 16];
const ddragonVersion = '14.10.1'; 

const SkillLevelGrid = ({ onChange, campeonNombre }) => {
  const [seleccion, setSeleccion] = useState(Array(niveles).fill(null));
  const [campeonData, setCampeonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const nivelCampeon = 18;
  
  const esUdyr = campeonNombre?.toLowerCase() === 'udyr';
  const esBardo = campeonNombre?.toLowerCase() === 'bardo';
  const esNunu = campeonNombre?.toLowerCase() === 'nunu y willump';
  const esMundo = campeonNombre?.toLowerCase() === 'dr. mundo';

  if(esBardo) campeonNombre= 'Bard';
  if(esNunu) campeonNombre= 'Nunu';
  if(esMundo) campeonNombre= 'DrMundo';

  useEffect(() => {
    if (!campeonNombre) return;

    setLoading(true);
    fetch(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/es_ES/champion/${campeonNombre}.json`)
      .then(res => res.json())
      .then(data => {
        setCampeonData(data.data[campeonNombre]);
        setLoading(false);
      })
      .catch(() => {
        setCampeonData(null);
        setLoading(false);
      });
  }, [campeonNombre]);

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

  if (loading) {
    return <div>Cargando datos del campeón...</div>;
  }

  if (!campeonData) {
    return <div>No se encontraron datos para el campeón "{campeonNombre}".</div>;
  }

  const passiveIcon = campeonData.passive.image.full;
  const passiveName = campeonData.passive.name;
  const passiveDesc = campeonData.passive.description;

  const spellIcons = habilidades.map(hab => {
    const spell = campeonData.spells.find(sp => sp.id.toUpperCase().endsWith(hab));
    return spell ? spell.image.full : null;
  });

  const spellNames = habilidades.map(hab => {
    const spell = campeonData.spells.find(sp => sp.id.toUpperCase().endsWith(hab));
    return spell ? spell.name : hab;
  });

  const spellDescs = habilidades.map(hab => {
    const spell = campeonData.spells.find(sp => sp.id.toUpperCase().endsWith(hab));
    return spell ? spell.description : '';
  });

  return (
    <div className={styles.skillGridContainer}>
      {/* Contenedor centrado para pasiva y habilidades */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12, gap: 20 }}>
        {/* Pasiva */}
        {passiveIcon && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/passive/${passiveIcon}`}
              alt={passiveName}
              title={`${passiveName}: ${passiveDesc.replace(/<[^>]+>/g, '')}`}
              style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <div style={{ fontSize: 14, marginTop: 4, fontWeight: 'bold' }}>P</div>
          </div>
        )}

        {/* Habilidades Q,W,E,R */}
        <div style={{ display: 'flex', gap: 10 }}>
          {habilidades.map((hab, idx) => (
            <div key={hab} style={{ textAlign: 'center' }}>
              {spellIcons[idx] ? (
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${spellIcons[idx]}`}
                  alt={spellNames[idx]}
                  title={`${spellNames[idx]}: ${spellDescs[idx].replace(/<[^>]+>/g, '')}`}
                  style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid #ccc' }}
                />
              ) : (
                <div
                  title={spellNames[idx]}
                  style={{
                    width: 40,
                    height: 40,
                    lineHeight: '40px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    userSelect: 'none',
                  }}
                >
                  {hab}
                </div>
              )}
              <div style={{ fontSize: 14, marginTop: 4, fontWeight: 'bold' }}>{hab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de niveles y habilidades */}
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
                  className={`${styles.skillGridCell} ${activo ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
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
