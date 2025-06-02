import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './spells.module.css'; // Importamos los estilos como módulo

const SummonerSpellsSelector = ({ 
  onSpellsChange, 
  initialSpells = [], 
  maxSelections = 2,
  version = '14.10.1',
  language = 'es_ES'
}) => {
  const [spells, setSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState(initialSpells);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtro = ["Limpiar","Extenuación","Destello","Prender","Barrera","Fantasmal","Curar","Aplastar","Teleportar"];

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/summoner.json`
        );

        console.log(response.data.data)
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

  const handleSpellClick = (spell) => {
    setSelectedSpells(prev => {
      if (prev.some(s => s.id === spell.id)) {
        return prev.filter(s => s.id !== spell.id);
      }
      
      if (prev.length < maxSelections) {
        return [...prev, spell];
      }
      
      return [...prev.slice(1), spell];
    });
  };

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
          <div className={styles.spellsGrid}>
            {spells.map(spell => (
              <div
                key={spell.id}
                className={`${styles.skillGridCell} ${
                  selectedSpells.some(s => s.id === spell.id) ? styles.active : ''
                }`}
                onClick={() => handleSpellClick(spell)}
                title={`${spell.name}: ${spell.description}`}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`}
                  alt={spell.name}
                  className={styles.spellImage}
                />
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