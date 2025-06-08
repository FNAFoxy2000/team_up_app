import React, { useEffect, useState } from 'react';
import './ListadoJuegos.css';
import { getAllJuegos } from '../peticiones/juego_peticiones.mjs';
import { getCategorias } from '../peticiones/categoria_peticiones.mjs';
import CardJuego from '../components/CardJuego';

const ListadoJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [orden, setOrden] = useState('az');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const juegosData = await getAllJuegos();
        const categoriasData = await getCategorias();
        setJuegos(juegosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    fetchData();
  }, []);

  const juegosFiltrados = juegos
    .filter(juego => {
      const coincideBusqueda = juego.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoriaFiltro || juego.categoria === categoriaFiltro;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (orden === 'az') return a.nombre.localeCompare(b.nombre);
      if (orden === 'za') return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  return (
    <div className="container">
      <h1 className="title">Todos los Juegos</h1>

      <div className="form">
        <input
          type="text"
          className="input"
          placeholder="Buscar juegos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="form filtersRow">
        <select
          className="select"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        >
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div className="listadoGuias grid-juegos">
        {juegosFiltrados.map((juego) => (
          <CardJuego key={juego.id_juego} juego={juego} categorias={categorias} />
        ))}
      </div>
    </div>

  );
};

export default ListadoJuegos;
