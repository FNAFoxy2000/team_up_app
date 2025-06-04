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
  const [selectedPosition, setSelectedPosition] = useState('');
  const [guideDescription, setGuideDescription] = useState('');
  
  const [selectedItems, setSelectedItems] = useState({
    starterItems: [],
    boots: [],
    items: []
  });

const positions = [
  {
    id: "top",
    name: "Top",
    icon: "https://wiki.leagueoflegends.com/en-us/images/Top_icon.png?58442",
  },
  {
    id: "jungle",
    name: "Jungla",
    icon: "https://wiki.leagueoflegends.com/en-us/images/Jungle_icon_WR.png?49747",
  },
  {
    id: "middle",
    name: "Mid",
    icon: "https://wiki.leagueoflegends.com/en-us/images/Middle_icon.png?fa3f0",
  },
  {
    id: "bottom",
    name: "ADC",
    icon: "https://wiki.leagueoflegends.com/en-us/images/Bottom_icon.png?6d4b2",
  },
  {
    id: "utility",
    name: "Soporte",
    icon: "https://wiki.leagueoflegends.com/en-us/images/Support_icon.png?af1ff",
  },
];

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

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
  };

  const handleDescriptionChange = (e) => {
    setGuideDescription(e.target.value);
  };

  const handlePrintSelections = () => {
    const dataToPrint = {
      campeon: campeonNombre,
      posicion: selectedPosition,
      descripcion: guideDescription,
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
        <h2 className={styles.sectionTitle}>Selecciona la posición</h2>
        <div className={styles.positionSelector}>
          {positions.map((position) => (
            <button
              key={position.id}
              className={`${styles.positionButton} ${selectedPosition === position.id ? styles.selectedPosition : ''
                }`}
              onClick={() => handlePositionSelect(position.id)}
              
            >
              <img
                src={position.icon}
                alt={position.name}
                className={styles.positionIcon}
              />
              <span className={styles.positionLabel}>{position.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Descripción de la guía</h2>
        <textarea
          className={styles.descriptionInput}
          value={guideDescription}
          onChange={handleDescriptionChange}
          placeholder="Escribe aquí los detalles de tu guía, consejos, matchups importantes, etc."
          rows={5}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Selecciona los Hechizos de invocador</h2>
        <SummonerSpellsSelector
          onSpellsChange={handleSpellsChange}
          initialSpells={summonerSpells}
          maxSelections={2}
          selectedPosition={selectedPosition}  
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
          disabled={!selectedPosition} 
        >
          Guardar Guía
        </button>
      </div>
    </div>
  );
};

export default GuiaCampeon;