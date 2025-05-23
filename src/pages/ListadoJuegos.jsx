import React, { useEffect, useState } from 'react';
import './ListadoJuegos.css';
import { getAllJuegos } from '../peticiones/juego_peticiones.mjs';
import { getCategorias } from '../peticiones/categoria_peticiones.mjs';
import CardJuego from '../components/CardJuego';

const ListadoJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState([]); // ahora es un array

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

  const toggleCategoria = (nombre) => {
    setCategoriaFiltro((prev) =>
      prev.includes(nombre)
        ? prev.filter(cat => cat !== nombre)
        : [...prev, nombre]
    );
  };

  const juegosFiltrados = juegos.filter(juego => {
    const coincideBusqueda = juego.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaFiltro.length === 0 || categoriaFiltro.includes(juego.categoria);
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="listado-juegos">
      <div className="topbar">
        <input
          type="text"
          placeholder="Buscar juegos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="contenido">
        <aside className="sidebar">
          <h3>Filtrar por Categoría</h3>
          <ul>
            {categorias.map(cat => (
              <li key={cat.id_categoria}>
                <label>
                  <input
                    type="checkbox"
                    checked={categoriaFiltro.includes(cat.nombre)}
                    onChange={() => toggleCategoria(cat.nombre)}
                  />
                  {cat.nombre}
                </label>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content">
          <h1 className="titulo-listado">Todos los Juegos</h1>
          <div className="grid-juegos">
            {juegosFiltrados.map((juego) => (
              <CardJuego key={juego.id_juego} juego={juego} categorias={categorias} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListadoJuegos;
