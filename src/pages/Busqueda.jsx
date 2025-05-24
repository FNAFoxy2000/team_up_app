import { useState, useEffect } from 'react';
import styles from './Busqueda.module.css';
import UsuarioCard from '../components/CardUsuario';
import { getAllUsuarios } from '../peticiones/usuario_peticiones.mjs';

function Busqueda() {
    // Estados para los filtros
    const [searchText, setSearchText] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const [isRegistered, setIsRegistered] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const cargarUsuarios = async () => {
        setLoading(true);
        try {
          const usuariosData = await getAllUsuarios();
          setUsuarios(usuariosData);
        } catch (error) {
          console.error("Error al cargar usuarios:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarUsuarios();
    }, []);

    // Filtrar usuarios por nombre
    const usuariosFiltrados = usuarios.filter(usuario =>
      usuario.nombre_usuario?.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Busca jugadores en TeamUp</h1>
                <p className={styles.description}>
                    Usa los filtros para encontrar jugadores que coincidan con tu estilo y preferencias de juego.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="NombreUsuario" className={styles.label}>Nombre de usuario:</label>
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
                            <option value="LoL">League of Legends</option>
                            <option value="CS">Counter Strike</option>
                            <option value="CR">Clash Royale</option>
                        </select>

                        <select
                            value={isRegistered}
                            onChange={(e) => setIsRegistered(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Registrado en TeamUp?</option>
                            <option value="true">Registrado</option>
                            <option value="false">No registrado</option>
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
                            <option value="rank">Rango</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.button}>
                        Buscar
                    </button>
                </form>

                <div className={styles.listadoUsuarios}>
                  {loading && <p>Cargando usuarios...</p>}
                  {!loading && usuariosFiltrados.length === 0 && <p>No se encontraron usuarios.</p>}
                  {!loading && usuariosFiltrados.map(usuario => (
                    <UsuarioCard key={usuario.id_usuario} usuario={usuario} />
                  ))}
                </div>
            </div>
        </>
    );
}

export default Busqueda;
