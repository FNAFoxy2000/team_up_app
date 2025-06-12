import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../components/Guias/guias.module.css';
import { showSuccess, showError, showInfo } from '../components/Toast';
import AuthService from '../services/authService';
import { guardarGuia } from '../peticiones/guias_peticiones.mjs'
import SkillsGrid from '../components/Guias/SkillsGrid';
import ItemSelector from '../components/Guias/ItemSelector';
import SummonerSpellsSelector from '../components/Guias/SummonersSpellsSelector';
import RuneSelector from '../components/Guias/RuneSelector';
import { useNavigate } from 'react-router-dom';

const GuiaCampeon = () => {
  const navigate = useNavigate();

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
  const [guideTitle, setGuideTitle] = useState('');
  const [guidePatch, setGuidePatch] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

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

  const validateGuideData = ({
    titulo,
    parche,
    campeon,
    posicion,
    descripcion,
    hechizosInvocador,
    ordenHabilidades,
    objetosIniciales,
    botas,
    objetosCompletos,
    runas
  }) => {
    if (!titulo.trim()) {
      showError("El título de la guía no puede estar vacío.");
      return false;
    }

    if (!/^\d+(\.\d+)*$/.test(parche)) {
      showError("El parche debe contener solo números y puntos (ej: 14.11).");
      return false;
    }

    if (!descripcion.trim()) {
      showError("La descripción no puede estar vacía.");
      return false;
    }

    if (!campeon) {
      showError("Debes seleccionar un campeón.");
      return false;
    }

    if (!posicion) {
      showError("Debes seleccionar una posición.");
      return false;
    }

    if (!Array.isArray(hechizosInvocador) || hechizosInvocador.length < 2) {
      showError("Debes seleccionar al menos 2 hechizos de invocador.");
      return false;
    }

    if (!Array.isArray(skillOrder) ||
      skillOrder.length !== 18 ||
      skillOrder.some(habilidad => habilidad === null || habilidad === undefined)) {
      showError("Debes asignar una habilidad para cada uno de los 18 niveles.");
      return false;
    }

    if (!Array.isArray(objetosIniciales) || objetosIniciales.length < 1 || objetosIniciales.length > 2) {
      showError("Selecciona entre 1 y 2 objetos iniciales.");
      return false;
    }

    if (!Array.isArray(botas) || botas.length < 1 || botas.length > 3) {
      showError("Selecciona entre 1 y 3 botas.");
      return false;
    }

    if (!Array.isArray(objetosCompletos) || objetosCompletos.length !== 5) {
      showError("Debes seleccionar exactamente 5 objetos completos.");
      return false;
    }

    if (
      !runes ||
      !runes.primaryPath ||
      !runes.secondaryPath ||
      !runes.selectedRunes ||
      !Array.isArray(runes.selectedRunes.primary) ||
      runes.selectedRunes.primary.length !== 4 ||
      !Array.isArray(runes.selectedRunes.secondary) ||
      runes.selectedRunes.secondary.length < 3
    ) {
      showError("Debes completar todas las runas: 4 principales, al menos 3 secundarias");
      return false;
    }

    return true;
  };

  const retornarObjeto = ({ dataToPrint }) => {
    return {
      titulo: guideTitle,
      parche: guidePatch,
      campeon: campeonNombre,
      posicion: selectedPosition,
      descripcion: guideDescription,
      hechizosInvocador: summonerSpells.map(spell => spell.id),
      ordenHabilidades: skillOrder,
      objetosIniciales: selectedItems.starterItems.map(object => object.id),
      botas: selectedItems.boots.map(object => object.id),
      objetosCompletos: selectedItems.items.map(object => object.id),
      runaPrincipal: runes.primaryPath,
      runaSecundaria: runes.secondaryPath,
      runasRamaPrincipal: runes.selectedRunes.primary,
      runasRamaSecundaria: runes.selectedRunes.secondary,
      privada: isPrivate

    }
  }

  const handlePrintSelections = async () => {
    const dataToPrint = {
      titulo: guideTitle,
      parche: guidePatch,
      campeon: campeonNombre,
      posicion: selectedPosition,
      descripcion: guideDescription,
      hechizosInvocador: summonerSpells,
      ordenHabilidades: skillOrder,
      objetosIniciales: selectedItems.starterItems,
      botas: selectedItems.boots,
      objetosCompletos: selectedItems.items,
      runas: runes,
      privada: isPrivate
    };

    if (!validateGuideData(dataToPrint)) {
      return;
    }


    const objetoGuardar = retornarObjeto(dataToPrint);


    const estaLogeado = AuthService.isAuthenticated();
    if (!estaLogeado) {
      showInfo("Debes estar logueado para guardar la guía");
      return;
    }

    const usr = AuthService.getUserFromToken();
    const lol_id = 2;

    try {
      await guardarGuia(
        usr.id_usuario,
        lol_id,
        objetoGuardar.campeon,
        objetoGuardar,
        objetoGuardar.privada
      );

      showSuccess("¡Guardado correctamente!");
      navigate('/guias/privadas');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error al guardar la guía:", error.response.data);
        showError("Error al guardar la guía: " + JSON.stringify(error.response.data));
      } else {
        console.error("Error al guardar la guía:", error.message);
        showError("Error al guardar la guía: " + error.message);
      }
    }
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
        <h2 className={styles.sectionTitle}>Título y Parche</h2>
        <div className={styles.titlePatchContainer}>
          <div className={styles.titleWrapper}>
            <input
              type="text"
              className={styles.titleInput}
              value={guideTitle}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setGuideTitle(e.target.value);
                }
              }}
              placeholder="Ejemplo: Electrolistar"
            />
            <p className={styles.inputHelper}>{guideTitle.length}/50 caracteres</p>
          </div>
          <div className={styles.patchWrapper}>
            <input
              type="text"
              className={styles.patchInput}
              value={guidePatch}
              onChange={(e) => {
                const regex = /^[0-9.]*$/;
                if (regex.test(e.target.value)) {
                  setGuidePatch(e.target.value);
                }
              }}
              placeholder="Parche 00.00"
            />

          </div>
          <div className={styles.privacyWrapper}>
            <input
              type="checkbox"
              id="privacyCheckbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label htmlFor="privacyCheckbox">Privada</label>
          </div>
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
        <ItemSelector
          onSelectionChange={handleItemChange}
          selectedPosition={selectedPosition}
        />
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