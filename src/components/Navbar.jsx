import styles from './Navbar.module.css';
import logo from '../assets/logo.png'; // reemplaza con tu imagen
import userIcon from '../assets/default-user.png'; // imagen por defecto

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => window.location.href = '/'}>
        <img src={logo} alt="TeamUp Logo" />
        <span>TeamUp</span>
      </div>

      <ul className={styles.navLinks}>
        <li><a href="#">LoL</a></li>
        <li><a href="#">Counter Strike</a></li>
        <li><a href="#">Clash Royale</a></li>
        <li><a href="#">+ Más</a></li>
      </ul>

      <div className={styles.userSection}>
        <img src={userIcon} alt="Usuario" className={styles.userIcon} />
        <span>Iniciar Sesión</span>
      </div>
    </nav>
  );
}

export default Navbar;
