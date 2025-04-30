import styles from './Navbar.module.css';
import logo from '../assets/logo.png';
import userIcon from '../assets/default-user.png'; // imagen por defecto
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="TeamUp Logo" />
        <span>TeamUp</span>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link to="/busqueda">Búsqueda</Link></li>
        <li><a href="#">Chats</a></li>
        <li><a href="#">Guias</a></li>
        <li><a href="#">Juegos</a></li>
      </ul>

      <div className={styles.userSection}>
        <img src={userIcon} alt="Usuario" className={styles.userIcon} />
        <span>Iniciar Sesión</span>
      </div>
    </nav>
  );
}

export default Navbar;
