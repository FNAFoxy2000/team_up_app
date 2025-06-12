import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './spells.module.css';

const SummonerSpellsSelector = ({
  onSpellsChange,
  initialSpells = [],
  maxSelections = 2,
  version = '14.10.1',
  language = 'es_ES',
  selectedPosition = ''
}) => {
  const [spells, setSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState(initialSpells);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtro para excluir datos de eventos u otros modos de juego
  const filtro = ["Limpiar", "Extenuación", "Destello", "Prender", "Barrera", "Fantasmal", "Curar", "Aplastar", "Teleportar"];

  // Carga de datos
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/summoner.json`
        );

        const filteredSpells = Object.values(response.data.data)
          .filter(spell => filtro.includes(spell.name));

        setSpells(filteredSpells);
      } catch (err) {
        setError('Error al cargar los hechizos');
        console.error('Error fetching summoner spells:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, [version, language]);

  // Encontrar el hechizo Aplastar (Smite)
  const smiteSpell = spells.find(spell => spell.name === "Aplastar");

  const handleSpellClick = (spell) => {
    // Si es jungla y se intenta deseleccionar Smite, no hacer nada
    if (selectedPosition === 'jungle' &&
      spell.name === "Aplastar" &&
      selectedSpells.some(s => s.id === spell.id)) {
      return;
    }

    setSelectedSpells(prev => {
      // Si ya está seleccionado, lo quitamos
      if (prev.some(s => s.id === spell.id)) {
        return prev.filter(s => s.id !== spell.id);
      }

      // Si es jungla, forzar a mantener Smite y añadir otro hechizo
      if (selectedPosition === 'jungle') {
        const hasSmite = prev.some(s => s.name === "Aplastar");
        if (hasSmite) {
          return [...prev.filter(s => s.name !== "Aplastar"), spell, smiteSpell].slice(-maxSelections);
        } else {
          return [spell, smiteSpell].slice(-maxSelections);
        }
      }

      // Selección normal (no jungla)
      if (prev.length < maxSelections) {
        return [...prev, spell];
      }

      return [...prev.slice(1), spell];
    });
  };

  // Efecto para forzar Smite si se selecciona jungla
  useEffect(() => {
    if (selectedPosition === 'jungle' && smiteSpell) {
      setSelectedSpells(prev => {
        const hasSmite = prev.some(s => s.name === "Aplastar");
        if (!hasSmite) {
          // Si no tiene Smite, lo añadimos y mantenemos otro hechizo si existe
          return [...prev.filter(s => s.name !== "Aplastar"), smiteSpell].slice(-maxSelections);
        }
        return prev;
      });
    }
  }, [selectedPosition, smiteSpell, maxSelections]);

  useEffect(() => {
    if (onSpellsChange) {
      onSpellsChange(selectedSpells);
    }
  }, [selectedSpells, onSpellsChange]);

  if (loading) return <div className={styles.spellsLoading}>Cargando hechizos...</div>;
  if (error) return <div className={styles.spellsError}>{error}</div>;

  return (
    <div className={styles.spellsGridContainer}>
      <div className={styles.skillGrid}>
        <div className={styles.skillGridHeader}>
          <div className={styles.skillGridCorner}></div>
          <div className={styles.skillGridHeaderCell}>Hechizos de Invocador</div>
        </div>

        <div className={styles.spellsContent}>
          {selectedPosition === 'jungle' && (
            <div className={styles.jungleWarning}>
              <strong>Jungla seleccionada:</strong> Debes llevar el hechizo "Aplastar" (Smite)
            </div>
          )}

          <div className={styles.spellsGrid}>
            {spells.map(spell => (
              <div
                key={spell.id}
                className={`${styles.skillGridCell} ${selectedSpells.some(s => s.id === spell.id) ? styles.active : ''
                  } ${selectedPosition === 'jungle' && spell.name === "Aplastar" ? styles.requiredSpell : ''
                  }`}
                onClick={() => handleSpellClick(spell)}
                title={`${spell.name}: ${spell.description}`}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`}
                  alt={spell.name}
                  className={styles.spellImage}
                />
                {selectedPosition === 'jungle' && spell.name === "Aplastar" && (
                  <div className={styles.requiredBadge}>Obligatorio</div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.selectedSpellsSection}>
            <h4>Hechizos seleccionados:</h4>
            {selectedSpells.length > 0 ? (
              <div className={styles.selectedSpellsGrid}>
                {selectedSpells.map(spell => (
                  <div key={spell.id} className={styles.selectedSpell}>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`}
                      alt={spell.name}
                    />
                    <span>{spell.name}</span>
                    {selectedPosition === 'jungle' && spell.name === "Aplastar" && (
                      <span className={styles.requiredTag}>(Requerido)</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noSpells}>No hay hechizos seleccionados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummonerSpellsSelector;