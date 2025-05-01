import styles from './SeccionJuego.module.css';

function SeccionJuego({ imagen, titulo, descripcion, onClick, invertido = false }) {
  return (
    <section
      className={`${styles.seccion} ${invertido ? styles.invertido : ''}`}
      onClick={onClick}
    >
      <div className={styles.imagen}>
        <img src={imagen} alt={titulo} />
      </div>
      <div className={styles.texto}>
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
      </div>
    </section>
  );
}

export default SeccionJuego;
