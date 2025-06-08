import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getGuiaPorId, eliminarGuia } from '../peticiones/guias_peticiones.mjs';
import AuthService from '../services/authService';
import { useParams } from 'react-router-dom';

import styles from "./GuiaDetalle.module.css"

function DatosGuia() {
  const [summonerSpells, setSummonerSpells] = useState(null);
  const [items, setItems] = useState(null);
  const [runes, setRunes] = useState(null);
  const [guia, setGuia] = useState(null);
  const [campeonData, setCampeonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  const { id } = useParams();
  const patchVersion = '14.10.1';

  useEffect(() => {
    const user = AuthService.getUserFromToken();
    if (user) {
      setUsuarioActivo(user);
    }
  }, []);

  useEffect(() => {
    const cargarDatosGuia = async (id_guia) => {
      setLoading(true);
      try {
        const response = await getGuiaPorId(id_guia);
        setGuia({
          ...response,
          contenido: JSON.parse(response.contenido_guia),
        });
      } catch (error) {
        console.error('Error al cargar guías:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarDatosGuia(id);
    }
  }, [id]);

  useEffect(() => {
    Promise.all([
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/es_ES/summoner.json`),
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/es_ES/item.json`),
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/es_ES/runesReforged.json`)
    ])
      .then(([spellsRes, itemsRes, runesRes]) => {
        setSummonerSpells(spellsRes.data.data);
        setItems(itemsRes.data.data);
        setRunes(runesRes.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (guia && guia.campeon_nombre) {
      axios.get(`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/es_ES/champion/${guia.campeon_nombre}.json`)
        .then(res => {
          setCampeonData(res.data.data[guia.campeon_nombre]);
        })
        .catch(console.error);
    }
  }, [guia]);

  const handleDelete = (e) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar esta guía? ${guia.contenido.titulo}`);
    if (confirmed) {
      eliminarGuia(guia.id_guia, usuarioActivo.id_usuario);
      window.location.href = '/guias/listadoGuias';
    }
  };

  if (loading) return <div className={styles.loadingText}>Cargando guía...</div>;
  if (!summonerSpells || !items || !runes || !guia || !guia.contenido) return <div className={styles.loadingText}>Cargando datos del juego...</div>;

  const { hechizosInvocador, objetosIniciales, botas, objetosCompletos, runaPrincipal, runaSecundaria, runasRamaPrincipal, runasRamaSecundaria, ordenHabilidades } = guia.contenido;

  const hechizosInvocadorInfo = hechizosInvocador.map(id => Object.values(summonerSpells).find(s => s.id === id));
  const objetosInicialesInfo = objetosIniciales.map(id => items[id]).filter(Boolean);
  const botasInfo = botas.map(id => items[id]).filter(Boolean);
  const objetosCompletosInfo = objetosCompletos.map(id => items[id]).filter(Boolean);

  const runasPrincipales = [];
  const runasSecundarias = [];

  const ramaPrincipalData = runes.find(r => r.id === runaPrincipal);
  const ramaSecundariaData = runes.find(r => r.id === runaSecundaria);

  if (ramaPrincipalData) {
    runasRamaPrincipal.forEach((grupo, i) => {
      const runa = ramaPrincipalData.slots[i]?.runes.find(r => r.id === grupo[0]);
      if (runa) runasPrincipales.push(runa);
    });
  }

  if (ramaSecundariaData) {
    let slots = ramaSecundariaData.slots.slice(1);
    runasRamaSecundaria.forEach(grupo => {
      let runa = slots.flatMap(s => s.runes).find(r => r.id === grupo[0]);
      if (runa) runasSecundarias.push(runa);
    });
  }

  return (
    <div className={styles.guiaContainer}>
      <div className={styles.header}>
        {campeonData && (
          <img 
            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${campeonData.image.full}`} 
            alt={campeonData.name}
            className={styles.championImage}
          />
        )}
        <div className={styles.headerInfo}>
          <h1 className={styles.championName}>{campeonData?.name || guia.campeon_nombre}</h1>
          <p className={styles.championRoles}>{campeonData?.title || ''}</p>
          <h2>{guia.contenido.titulo}</h2>
          <p>Por {guia.nombre_usuario}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Información General</h3>
        <p className={styles.descriptionText}><strong>Descripción:</strong> {guia.contenido.descripcion}</p>
        <p className={styles.descriptionText}><strong>Posición:</strong> {guia.contenido.posicion}</p>
        <p className={styles.descriptionText}><strong>Parche:</strong> {guia.contenido.parche}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Hechizos de Invocador</h3>
        <div className={styles.spellsContainer}>
          {hechizosInvocadorInfo.map(spell => (
            <div key={spell.id} className={styles.spellItem}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${spell.image.full}`}
                alt={spell.name}
                title={`${spell.name}: ${spell.description.replace(/<[^>]*>/g, ' ')}`}
              />
              <span>{spell.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Orden de Habilidades</h3>
        <div className={styles.skillsContainer}>
          {campeonData && (
            <div className={styles.skillsIcons}>
              <div className={styles.skillIcon}>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/passive/${campeonData.passive.image.full}`}
                  alt={campeonData.passive.name}
                  title={`Pasiva: ${campeonData.passive.name}`}
                />
                <span>P</span>
              </div>
              {campeonData.spells.map((spell, index) => (
                <div key={index} className={styles.skillIcon}>
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${spell.image.full}`}
                    alt={spell.name}
                    title={`${['Q', 'W', 'E', 'R'][index]}: ${spell.name}`}
                  />
                  <span>{['Q', 'W', 'E', 'R'][index]}</span>
                </div>
              ))}
            </div>
          )}
          <div className={styles.skillsOrder}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  {[...Array(18)].map((_, i) => (
                    <th key={i}>{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Q", "W", "E", "R"].map((habilidad, filaIndex) => (
                  <tr key={habilidad}>
                    <td><strong>{habilidad}</strong></td>
                    {[...Array(18)].map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className={ordenHabilidades[colIndex] === habilidad ? styles.activeSkill : ""}
                      ></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Build Inicial</h3>
        <div className={styles.initialBuildContainer}>
          <div className={styles.initialItemsSection}>
            <h4>Objetos Iniciales</h4>
            <div className={styles.itemsContainer}>
              {objetosInicialesInfo.map(item => (
                <div key={item.name} className={styles.item}>
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${item.image.full}`} 
                    alt={item.name}
                    title={`${item.name}: ${item.description.replace(/<[^>]*>/g, ' ')}`} 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bootsSection}>
            <h4>Botas</h4>
            <div className={styles.itemsContainer}>
              {botasInfo.map(item => (
                <div key={item.name} className={styles.item}>
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${item.image.full}`} 
                    alt={item.name}
                    title={`${item.name}: ${item.description.replace(/<[^>]*>/g, ' ')}`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Objetos Completos</h3>
        <div className={styles.itemsContainer}>
          {objetosCompletosInfo.map((item,index )=> (
            <div key={item.name} className={styles.item}>
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${item.image.full}`} 
                alt={item.name}
                title={`${item.name}: ${item.description.replace(/<[^>]*>/g, ' ')}`} 
              />
            </div>

          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Runas Principales</h3>
        <div className={styles.runesContainer}>
          {runasPrincipales.map(runa => (
            <div key={runa.id} className={styles.rune}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/${runa.icon}`}
                alt={runa.name}
                title={runa.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Runas Secundarias</h3>
        <div className={styles.runesContainer}>
          {runasSecundarias.map(runa => (
            <div key={runa.id} className={styles.rune}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/${runa.icon}`}
                alt={runa.name}
                title={runa.name}
              />
            </div>
          ))}
        </div>
      </div>

      {usuarioActivo && usuarioActivo.id_usuario === guia.id_usuario && (
        <div className={styles.actionsContainer}>
          <button onClick={handleDelete} className={styles.deleteButton}>Eliminar guía</button>
        </div>
      )}
    </div>
  );
}

export default DatosGuia;
