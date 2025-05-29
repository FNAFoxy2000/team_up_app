import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SkillsGrid from '../components/Guias/SkillsGrid';  
import ItemSelector from '../components/Guias/ItemSelector';


const GuiaCampeon = () => {
  const { championId } = useParams();
  const [campeon, setCampeon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampeon = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/champion/${championId}.json`
        );
        const champData = res.data.data[championId];
        setCampeon(champData);
      } catch (err) {
        setError('Error al cargar los datos del campeón.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampeon();
  }, [championId]);

  const handleSkillChange = (orden) => {
    console.log('Orden de habilidades:', orden);
  };

  if (loading) return <p style={{ color: 'white' }}>Cargando datos del campeón...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!campeon) return null;

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${campeon.image.full}`}
          alt={campeon.name}
          style={{ width: 80, height: 80 }}
        />
        <div>
          <h1>{campeon.name}</h1>
          <p><strong>Roles:</strong> {campeon.tags.join(', ')}</p>
        </div>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <h2>Descripción</h2>
        <p>{campeon.lore}</p>
      </section>

      <div style={{ marginTop: '2rem' }}>
        <h2>Configura el orden de habilidades</h2>
        <SkillsGrid onChange={handleSkillChange} />
      </div>

      <ItemSelector onChange={(seleccion) => console.log(seleccion)} />


      {/* Aquí seguirías con otras secciones como Runas, Objetos, etc. */}
    </div>
  );
};

export default GuiaCampeon;
