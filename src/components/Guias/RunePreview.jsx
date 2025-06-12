import React from 'react';
import styles from './RunePreview.module.css';

// Componenete creado para ver las runas seleccionadas

const RunePreview = ({ primaryPath, secondaryPath, selectedRunes, runesData }) => {
  if (!runesData || runesData.length === 0) {
    return <div className={styles.runePreview}>Cargando runas...</div>;
  }

  const renderRune = (id) => {
    for (const path of runesData) {
      for (const slot of path.slots) {
        const rune = slot.runes.find(r => r.id === id);
        if (rune) {
          return (
            <img
              key={id}
              src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
              alt={rune.name}
              className={styles.previewRune}
              title={rune.name}
            />
          );
        }
      }
    }
    return null;
  };

  return (
    <div className={styles.runePreview}>
      <h4>Runas seleccionadas</h4>

      {primaryPath && (
        <>
          <h5>Principal</h5>
          <div className={styles.primaryRunes}>
            {selectedRunes.primary[0]?.length > 0 && renderRune(selectedRunes.primary[0][0])}
            <div className={styles.subRunes}>
              {[1, 2, 3].map(i =>
                selectedRunes.primary[i]?.length > 0 ? renderRune(selectedRunes.primary[i][0]) : null
              )}
            </div>
          </div>
        </>
      )}

      {secondaryPath && (
        <>
          <h5>Secundaria</h5>
          <div className={styles.subRunes}>
            {selectedRunes.secondary.flat().map(id => renderRune(id))}
          </div>
        </>
      )}

      {selectedRunes.fragments.length > 0 && (
        <>
          <h5>Fragmentos</h5>
          {selectedRunes.fragments.map((frag, i) =>
            frag ? <span key={i} className={styles.previewFragment}>{frag}</span> : null
          )}
        </>
      )}
    </div>
  );
};

export default RunePreview;
