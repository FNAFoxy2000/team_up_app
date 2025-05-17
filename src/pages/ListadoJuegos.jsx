import React, { useEffect, useState } from 'react';
import './ListadoJuegos.css';
import { getAllJuegos } from '../peticiones/juego_peticiones.mjs';
import CardJuego from '../components/CardJuego';

const ListadoJuegos = () => {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const data = await getAllJuegos();
        setJuegos(data);
      } catch (error) {
        console.error('Error cargando juegos:', error);
      }
    };
    fetchJuegos();
  }, []);

  return (
    <div className="listado-juegos">
      <h1 className="titulo-listado">Todos los Juegos</h1>
      <div className="grid-juegos">
        {juegos.map((juego) => (
          <CardJuego key={juego.id_juego} juego={juego} />
        ))}
      </div>
    </div>
  );
};

export default ListadoJuegos;
