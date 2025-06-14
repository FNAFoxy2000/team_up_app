import React, { useState, useCallback } from 'react';
import styles from '../components/Guias/guias.module.css';
import AuthService from '../services/authService';
import RuneSelector from '../components/Guias/RuneSelector';

const GuiasSinApi = () => {
  const [runes, setRunesData] = useState({});
  const userFromToken = AuthService.getUserFromToken();
  if (!userFromToken) {
    navigate('/NoLogin', { replace: true });
    return;
  }

  const handleRunesChange = useCallback((data) => {
    setRunesData(data);
  }, []);

  const handlePrintSelections = () => {
    /* console.log('----- GUARDAR GUÍA -----');
    console.log('Datos para guardar:', runes);
    console.log('-----------------------'); */
    alert('Datos de la guía listos para guardar. Revisa la consola para ver los detalles.');
  };

  return (
    <div className={styles.guiaContainer}>
      <header className={styles.header}>
        <p>Runas</p>
      </header>

      <RuneSelector onChange={handleRunesChange} />

      <div className={styles.section}>
        <button
          onClick={handlePrintSelections}
          className={styles.printButton}
        >
          Guardar Guía
        </button>
      </div>
    </div>
  );
};

export default GuiasSinApi;
