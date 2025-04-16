import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} TeamUp. Todos los derechos reservados.</p>
      <p>Creado por gamers, para gamers.</p>
    </footer>
  );
}

export default Footer;
