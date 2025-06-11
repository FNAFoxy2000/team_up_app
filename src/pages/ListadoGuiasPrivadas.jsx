import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListadoGuias.css';
import GuiaCard from '../components/CardGuia';
import { getAllGuiasUsuario, getCampeones } from '../peticiones/guias_peticiones.mjs';
import AuthService from '../services/authService';
import { showSuccess, showError, showInfo } from '../components/Toast';

function Guias() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [campeones, setCampeones] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState('');


  useEffect(() => {
    const userFromToken = AuthService.getUserFromToken();
    setUsuario(userFromToken); // Guardamos si está logueado o no


    const cargarGuias = async () => {
      setLoading(true);
      try {
        const response = await getAllGuiasUsuario(userFromToken.id_usuario);
        // console.log(response)
        const guiasData = response.data.map((guia) => ({
          ...guia,
          contenido: JSON.parse(guia.contenido_guia)
        }));
        setGuias(guiasData);
      } catch (error) {
        console.error('Error al cargar guías:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarGuias();

    const cargarCampeones = async () => {
      try {
        const response = await getCampeones();
        setCampeones(response);
      } catch (error) {
        console.error('Error al cargar campeones:', error);
      }
    };

    cargarCampeones();


  }, []);

  const gameMapping = {
    'LoL': 2,
    'CS': 1,
    'CR': 3
  };

  const guiasFiltradas = guias.filter((guia) => {
    const lowerSearch = searchText.toLowerCase();
    const matchesUser = guia.nombre_usuario.toLowerCase().includes(lowerSearch);
    const matchesTitle = guia.contenido.titulo.toLowerCase().includes(lowerSearch);
    const matchesGame = selectedGame ? guia.id_juego === gameMapping[selectedGame] : true;
    const matchesChampion = selectedChampion ? guia.campeon_nombre === selectedChampion : true;

    return (matchesUser || matchesTitle) && matchesGame && matchesChampion;
  });

  const sortedGuias = [...guiasFiltradas];

  if (orderBy === 'asc') {
    sortedGuias.sort((a, b) => a.contenido.titulo.localeCompare(b.contenido.titulo));
  } else if (orderBy === 'desc') {
    sortedGuias.sort((a, b) => b.contenido.titulo.localeCompare(a.contenido.titulo));
  } else if (orderBy === 'date') {
    sortedGuias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } else if (orderBy === 'champ') {
    sortedGuias.sort((a, b) => a.campeon_nombre.localeCompare(b.campeon_nombre));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCrearGuia = () => {
    if (usuario) {
      navigate('/guias/crear');
    } else {
      showError('Debes iniciar sesión para crear una guía');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Busca Guias en TeamUp</h1>
      <p className="description">
        Usa los filtros para encontrar guías de tus juegos favoritos.
      </p>

      <div className="botonesGuiaContainer">
        <button
          onClick={handleCrearGuia}
          className="crearGuiaBtn"
        >
          Crear Guía
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="NombreUsuario" className="label">
            Nombre de usuario:
          </label>
          <input
            id="NombreUsuario"
            type="text"
            placeholder="Buscar por nombre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input"
          />
        </div>

        <div className="filtersRow">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="select"
          >
            <option value="">Todos los juegos</option>
            <option value="LoL">League of Legends</option>
            <option value="CS">Counter Strike</option>
            <option value="CR">Clash Royale</option>
          </select>

          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="select"
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Nombre (A-Z)</option>
            <option value="desc">Nombre (Z-A)</option>
            <option value="date">Fecha de creación</option>
            <option value="champ">Campeón</option>
          </select>

          <select
            value={selectedChampion}
            onChange={(e) => setSelectedChampion(e.target.value)}
            className="select"
          >
            <option value="">Todos los campeones</option>
            {campeones.map((campeon) => (
              <option key={campeon.id_campeon} value={campeon.id_campeon}>
                {campeon.nombre}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="listadoGuias">
        {loading && <p>Cargando guías...</p>}
        {!loading && sortedGuias.length === 0 && <p>No se encontraron guías.</p>}
        {!loading &&
          sortedGuias.map((guia) => (
            <GuiaCard key={guia.id_guia} guia={guia} />
          ))}
      </div>
    </div>
  );
}

export default Guias;
