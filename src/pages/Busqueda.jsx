import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Busqueda.module.css';
import UsuarioCard from '../components/CardUsuario';
import { getAllJuegos } from '../peticiones/juego_peticiones.mjs';
import { getAllUsuarios } from '../peticiones/usuario_peticiones.mjs';
import AuthService from '../services/authService';

function Busqueda() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [isRegistered, setIsRegistered] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userFromToken = AuthService.getUserFromToken();
    if (!userFromToken) {
      navigate('/LoginError', { replace: true });
      return;
    }

    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [usuariosData, juegosData] = await Promise.all([
          getAllUsuarios(),
          getAllJuegos()
        ]);
        setUsuarios(usuariosData);
        setJuegos(juegosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const handleSubmit = (e) => e.preventDefault();

  // Aplicar filtros
  const usuariosFiltrados = usuarios
    .filter((usuario) =>
      usuario.nombre_usuario?.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((usuario) => {
      if (!selectedGame) return true;
      const gameId = parseInt(selectedGame);
      return Array.isArray(usuario.juegos) && usuario.juegos.includes(gameId);
    })
    .filter((usuario) =>
      isRegistered === ''
        ? true
        : isRegistered === 'true'
          ? usuario.registrado === true
          : usuario.registrado === false
    )
    .sort((a, b) => {
      if (orderBy === 'asc') return a.nombre_usuario.localeCompare(b.nombre_usuario);
      if (orderBy === 'desc') return b.nombre_usuario.localeCompare(a.nombre_usuario);
      if (orderBy === 'date') return new Date(b.fecha_registro) - new Date(a.fecha_registro);
      return 0;
    });


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Busca jugadores en TeamUp</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="NombreUsuario" className={styles.label}>
            Nombre de usuario:
          </label>
          <input
            id="NombreUsuario"
            type="text"
            placeholder="Buscar por nombre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filtersRow}>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos los juegos</option>
            {juegos.map((juego) => (
              <option key={juego.id_juego} value={juego.id_juego}>
                {juego.nombre}
              </option>
            ))}
          </select>

          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className={styles.select}
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Nombre (A-Z)</option>
            <option value="desc">Nombre (Z-A)</option>
            <option value="date">Fecha de registro</option>
          </select>
        </div>
      </form>

      <div className={styles.listadoUsuarios}>
        {loading && <p>Cargando usuarios...</p>}
        {!loading && usuariosFiltrados.length === 0 && <p>No se encontraron usuarios.</p>}
        {!loading &&
          usuariosFiltrados.map((usuario) => (
            <UsuarioCard key={usuario.id_usuario} usuario={usuario} />
          ))}
      </div>
    </div>
  );
}

export default Busqueda;
