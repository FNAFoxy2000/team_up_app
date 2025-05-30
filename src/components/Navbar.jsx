import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import logo from '../assets/logo.png';
import userIcon from '../assets/default-user.png';
import { Link } from 'react-router-dom';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import AuthService from '../services/authService';

const apiURL = import.meta.env.VITE_API_URL;

function Navbar() {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() =>{
    // Sacamos el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get(`token`);

    // Si el token esta en la URL lo guardamos en la sesion y lo decodificamos
    if(token){
      AuthService.saveToken(token);
      const decoded = AuthService.decodeToken(token)

      if(decoded){
        setUser(decoded); // Lo guardamos en el local storage
        setIsAuthenticated(true) // Marcamos como que hay un usuario autenticado
        
        // Limpiamos la url
        window.history.replaceState({}, document.title, window.location.pathname);
      } 
    } else {
      // Si no hay token en la url, intentamos sacarlo del local storage
      const decoded = AuthService.getUserFromToken();
      if(decoded){
        setUser(decoded);
        setIsAuthenticated(true)
      }
    }
  },[]); // Esto solo se ejecutara una vez al montar el componente


  // Funcion para cerrar sesion
  const handleLogout = () => {
    AuthService.clearToken();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="TeamUp Logo" />
        <span>TeamUp</span>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link to="/juegos/listadoJuegos">Juegos</Link></li>
        <li><Link to="/busqueda">Búsqueda</Link></li>
        <li><a href="/chat">Chats</a></li>
        <li><a href="#">Guias</a></li>
      </ul>


      {/* Seccion para el login */}
      <div className={styles.userSection}>
      {/* Si el usuario esta autenticado cargamos los datos */}
        {isAuthenticated ? ( 
          <>
            <Link to={`/usuario/datosUsuario?email=${encodeURIComponent(user.email)}`}>
                <img
                  src={user.avatar || userIcon}
                  alt="Avatar"
                  className={styles.userIcon}
                  title={user.username}
                  referrerPolicy="no-referrer"
                />
              </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar sesión
            </button>
          </>
        ) : ( // Si no lo esta cargamos los botones para que pueda hacer login
          <div style={{ display: 'flex' }}>
            <button 
              className={styles.discordButton}
              onClick={() => window.location.href = `${apiURL}/auth/discord`}
            >
              <FaDiscord /> Discord
            </button>
            <button
              className={styles.googleButton}
              onClick={() => window.location.href = `${apiURL}/auth/google`}
            >
              <FaGoogle /> Google
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
