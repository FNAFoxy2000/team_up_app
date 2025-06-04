import React, { useState, useEffect } from 'react';
import './RuneSelector.css';
import RunePreview from './RunePreview';
import runesData from './runesData.json';

const RuneSelector = ({ onChange }) => {
  const [primaryPath, setPrimaryPath] = useState(null);
  const [secondaryPath, setSecondaryPath] = useState(null);
  const [selectedRunes, setSelectedRunes] = useState({
    primary: [],
    secondary: [],
    fragments: []
  });

  const handlePrimarySelect = (path) => {
    setPrimaryPath(path);
    setSelectedRunes({ primary: [], secondary: [], fragments: [] });
    setSecondaryPath(null);
  };

  const handleSecondarySelect = (path) => {
    if (path !== primaryPath) setSecondaryPath(path);
  };

  const handleRuneSelect = (pathType, rowIndex, runeId) => {
    setSelectedRunes(prev => {
      const updated = { ...prev };
      const current = [...(prev[pathType][rowIndex] || [])];
      updated[pathType][rowIndex] = [runeId];
      return updated;
    });
  };

  const handleFragmentSelect = (index, fragment) => {
    setSelectedRunes(prev => {
      const newFragments = [...prev.fragments];
      newFragments[index] = fragment;
      return { ...prev, fragments: newFragments };
    });
  };

  useEffect(() => {
    onChange({ primaryPath, secondaryPath, selectedRunes });
  }, [primaryPath, secondaryPath, selectedRunes, onChange]);

  return (
    <div className="rune-selector-layout">
      <div className="rune-column">
        <div className="paths primary">
          {runesData.paths.map((path) => (
            <img
              key={path.id}
              src={path.icon}
              alt={path.name}
              className={`path-icon ${primaryPath === path.id ? 'selected' : ''}`}
              onClick={() => handlePrimarySelect(path.id)}
            />
          ))}
        </div>

        {primaryPath && (
          <div className="runes">
            {runesData.paths.find(p => p.id === primaryPath).slots.map((slot, i) => (
              <div key={i} className="rune-row">
                {slot.runes.map(rune => (
                  <img
                    key={rune.id}
                    src={rune.icon}
                    alt={rune.name}
                    className={`rune-icon ${selectedRunes.primary[i]?.includes(rune.id) ? 'selected' : ''}`}
                    onClick={() => handleRuneSelect('primary', i, rune.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {primaryPath && (
        <div className="rune-column">
          <div className="paths secondary">
            {runesData.paths.map((path) => (
              path.id !== primaryPath && (
                <img
                  key={path.id}
                  src={path.icon}
                  alt={path.name}
                  className={`path-icon ${secondaryPath === path.id ? 'selected' : ''}`}
                  onClick={() => handleSecondarySelect(path.id)}
                />
              )
            ))}
          </div>

          {secondaryPath && (
            <div className="runes secondary">
              {runesData.paths.find(p => p.id === secondaryPath).slots.slice(1).map((slot, i) => (
                <div key={i} className="rune-row">
                  {slot.runes.map(rune => (
                    <img
                      key={rune.id}
                      src={rune.icon}
                      alt={rune.name}
                      className={`rune-icon ${selectedRunes.secondary[i]?.includes(rune.id) ? 'selected' : ''}`}
                      onClick={() => handleRuneSelect('secondary', i, rune.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rune-column preview">
        <RunePreview 
          primaryPath={primaryPath} 
          secondaryPath={secondaryPath} 
          selectedRunes={selectedRunes} 
          runesData={runesData}
        />
      </div>
    </div>
  );
};

export default RuneSelector;
