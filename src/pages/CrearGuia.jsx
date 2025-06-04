import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../components/Guias/guias.module.css';

import SkillsGrid from '../components/Guias/SkillsGrid';
import ItemSelector from '../components/Guias/ItemSelector';
import SummonerSpellsSelector from '../components/Guias/SummonersSpellsSelector';
import RuneSelector from '../components/Guias/RuneSelector';


const GuiaCampeon = () => {
  const { championId } = useParams();
  const [campeon, setCampeon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summonerSpells, setSummonerSpells] = useState([]);
  const [campeonNombre, setCampeonNombre] = useState('');
  const [skillOrder, setSkillOrder] = useState([]);
  const [runes, setRunesData] = useState({});
  
  const [selectedItems, setSelectedItems] = useState({
    starterItems: [],
    boots: [],
    items: []
  });

  // Referencia para el nombre del campeón en el título de la página
  useEffect(() => {
    if (campeonNombre) {
      document.title = `Guía de ${campeonNombre} - LoL Guías`;
    }
  }, [campeonNombre]);

  useEffect(() => {
    const fetchCampeon = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/champion/${championId}.json`
        );
        const champData = res.data.data[championId];
        setCampeon(champData);
        setCampeonNombre(champData.name);
      } catch (err) {
        setError('Error al cargar los datos del campeón.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampeon();
  }, [championId]);

  const handleSkillChange = (orden) => {
    setSkillOrder(orden);
  };

  const handleItemChange = (seleccion) => {
    setSelectedItems(seleccion);
  };

  const handleSpellsChange = (selectedSpells) => {
    setSummonerSpells(selectedSpells);
  };

  const handleRunesChange = useCallback((data) => {
    setRunesData(data);
  }, []);

  

  const handlePrintSelections = () => {
    const dataToPrint = {
      campeon: campeonNombre,
      hechizosInvocador: summonerSpells,
      ordenHabilidades: skillOrder,
      objetosIniciales: selectedItems.starterItems,
      botas: selectedItems.boots,
      objetosCompletos: selectedItems.items,
      runas: runes
    };

    console.log('----- GUARDAR GUÍA -----');
    console.log('Datos para guardar:', dataToPrint);
    console.log('-----------------------');
    
    // Opcional: Mostrar alerta al usuario
    alert('Datos de la guía listos para guardar. Revisa la consola para ver los detalles.');
  };

  if (loading) return <p className={styles.loadingText}>Cargando datos del campeón...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!campeon) return null;

  return (
    <div className={styles.guiaContainer}>
      <header className={styles.header}>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${campeon.image.full}`}
          alt={campeon.name}
          className={styles.championImage}
        />
        <div className={styles.headerInfo}>
          <h1 className={styles.championName}>{campeon.name}</h1>
          <p className={styles.championRoles}><strong>Roles:</strong> {campeon.tags.join(', ')}</p>
        </div>
      </header>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Selecciona los Hechizos de invocador</h2>
        <SummonerSpellsSelector
          onSpellsChange={handleSpellsChange}
          initialSpells={summonerSpells}
          maxSelections={2}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Selecciona las runas</h2>
        <RuneSelector
           onChange={handleRunesChange}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Configura el orden de habilidades</h2>
        <SkillsGrid onChange={handleSkillChange} campeonNombre={campeon.name} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Selecciona los objetos</h2>
        <ItemSelector onSelectionChange={handleItemChange} />
      </div>

      <div className={styles.section}>
        <button 
          onClick={handlePrintSelections}
          className={styles.printButton}
        >
          Guardar Guía
        </button>
      </div>
    </div>
  );
};

export default GuiaCampeon;