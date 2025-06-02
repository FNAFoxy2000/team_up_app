import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const rolesMap = {
  All: 'Todos',
  Fighter: 'Luchador',
  Tank: 'Tanque',
  Mage: 'Mago',
  Assassin: 'Asesino',
  Marksman: 'Tirador',
  Support: 'Soporte',
};

const allRoles = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'];

const ChampionGrid = () => {
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const res = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/champion.json'
        );
        const champList = Object.values(res.data.data);
        setChampions(champList);
      } catch (err) {
        console.error('Error al cargar campeones:', err);
      }
    };

    fetchChampions();
  }, []);

  const filtered = champions.filter(champ => {
    const nameMatch = champ.name.toLowerCase().includes(search.toLowerCase());
    if (activeRole === 'All') return nameMatch;
    return nameMatch && champ.tags.includes(activeRole);
  });

  const handleClick = (championId) => {
    navigate(`/guias/crear/${championId}`);
  };

  return (
    <div className={styles.championGridContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Buscar campeón..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabsContainer}>
        {allRoles.map(role => (
          <button
            key={role}
            className={`${styles.tab} ${activeRole === role ? styles.activeTab : ''}`}
            onClick={() => setActiveRole(role)}
          >
            {rolesMap[role]}
          </button>
        ))}
      </div>

      <div className={styles.championGrid}>
        {filtered.map(champ => (
          <div
            key={champ.id}
            onClick={() => handleClick(champ.id)}
            className={styles.championCard}
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champ.image.full}`}
              alt={champ.name}
              className={styles.championImage}
            />
            <div className={styles.championName}>{champ.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChampionGrid;
