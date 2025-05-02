import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import styles from './Busqueda.module.css';

function Busqueda() {
    // Estados para los filtros
    const [searchText, setSearchText] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const [isRegistered, setIsRegistered] = useState('');
    const [orderBy, setOrderBy] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí enviarías los datos a tu API
        const filtros = {
            searchText,
            selectedGame,
            isRegistered,
            orderBy
        };

        console.log('Filtros enviados:', filtros);

        // Luego harías una llamada fetch o axios a tu API
        // fetch('/api/busqueda', { method: 'POST', body: JSON.stringify(filtros) })...
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


                {/* Aquí debajo luego mostraremos los resultados que devuelve la API */}
            </div>
        </>
    );
}

export default Busqueda;