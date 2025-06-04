import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RunePreview from './RunePreview';
import styles from './RuneSelector.module.css';

const RuneSelector = ({ onChange }) => {
  const [runesData, setRunesData] = useState([]);
  const [primaryPath, setPrimaryPath] = useState(null);
  const [secondaryPath, setSecondaryPath] = useState(null);
  const [selectedRunes, setSelectedRunes] = useState({
    primary: [],
    secondary: [],
    fragments: []
  });

  useEffect(() => {
    const fetchRunes = async () => {
      try {
        const response = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/runesReforged.json'
        );
        setRunesData(response.data);
      } catch (error) {
        console.error('Error al cargar las runas:', error);
      }
    };

    fetchRunes();
  }, []);

  useEffect(() => {
    onChange({ primaryPath, secondaryPath, selectedRunes });
  }, [primaryPath, secondaryPath, selectedRunes, onChange]);

  const handlePrimarySelect = (path) => {
    setPrimaryPath(path.id);
    setSelectedRunes({ primary: [], secondary: [], fragments: [] });
    setSecondaryPath(null);
  };

  const handleSecondarySelect = (path) => {
    if (path.id !== primaryPath) setSecondaryPath(path.id);
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

  const getPathById = (id) => runesData.find(p => p.id === id);

  const getTooltip = (desc) => desc ? desc.replace(/<[^>]+>/g, '') : '';

  return (
    <div className={styles.runeSelectorLayout}>
      <div className={styles.runeColumn}>
        <div className={`${styles.paths} ${styles.primary}`}>
          {runesData.map((path) => (
            <img
              key={path.id}
              src={`https://ddragon.leagueoflegends.com/cdn/img/${path.icon}`}
              alt={path.name}
              className={`${styles.pathIcon} ${primaryPath === path.id ? styles.selected : ''}`}
              onClick={() => handlePrimarySelect(path)}
              title={path.name}
            />
          ))}
        </div>

        {primaryPath && (
          <div className={styles.runes}>
            {getPathById(primaryPath).slots.map((slot, i) => (
              <div key={i} className={styles.runeRow}>
                {slot.runes.map(rune => (
                  <img
                    key={rune.id}
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                    alt={rune.name}
                    className={`${styles.runeIcon} ${selectedRunes.primary[i]?.includes(rune.id) ? styles.selected : ''}`}
                    onClick={() => handleRuneSelect('primary', i, rune.id)}
                    title={getTooltip(rune.shortDesc)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {primaryPath && (
        <div className={styles.runeColumn}>
          <div className={`${styles.paths} ${styles.secondary}`}>
            {runesData.map((path) => (
              path.id !== primaryPath && (
                <img
                  key={path.id}
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${path.icon}`}
                  alt={path.name}
                  className={`${styles.pathIcon} ${secondaryPath === path.id ? styles.selected : ''}`}
                  onClick={() => handleSecondarySelect(path)}
                  title={path.name}
                />
              )
            ))}
          </div>

          {secondaryPath && (
            <div className={`${styles.runes} ${styles.secondary}`}>
              {getPathById(secondaryPath).slots.slice(1).map((slot, i) => (
                <div key={i} className={styles.runeRow}>
                  {slot.runes.map(rune => (
                    <img
                      key={rune.id}
                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                      alt={rune.name}
                      className={`${styles.runeIcon} ${selectedRunes.secondary[i]?.includes(rune.id) ? styles.selected : ''}`}
                      onClick={() => handleRuneSelect('secondary', i, rune.id)}
                      title={getTooltip(rune.shortDesc)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.runeColumn}>
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
