import React from 'react';
import './RunePreview.css';

const RunePreview = ({ primaryPath, secondaryPath, selectedRunes, runesData }) => {
  const getPathById = (id) => runesData.paths.find(p => p.id === id);
  const getRuneById = (id) => {
    for (const path of runesData.paths) {
      for (const slot of path.slots) {
        for (const rune of slot.runes) {
          if (rune.id === id) return rune;
        }
      }
    }
    return null;
  };

  return (
    <div className="rune-preview">
      <h3>Runas seleccionadas</h3>

      {primaryPath && (
        <div className="rune-section">
          <p className="rune-title">Principal: {getPathById(primaryPath)?.name}</p>
          <div className="rune-icons">
            {selectedRunes.primary.map((row, i) =>
              row?.map(id => {
                const rune = getRuneById(id);
                return (
                  <img
                    key={id}
                    src={rune?.icon}
                    alt={rune?.name}
                    className="rune-preview-icon"
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {secondaryPath && (
        <div className="rune-section">
          <p className="rune-title">Secundaria: {getPathById(secondaryPath)?.name}</p>
          <div className="rune-icons">
            {selectedRunes.secondary.map((row, i) =>
              row?.map(id => {
                const rune = getRuneById(id);
                return (
                  <img
                    key={id}
                    src={rune?.icon}
                    alt={rune?.name}
                    className="rune-preview-icon"
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RunePreview;
