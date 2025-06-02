import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Busqueda from './pages/Busqueda';
import Juego from './pages/Juego';
import ListadoJuegos from './pages/ListadoJuegos';
import LoginError from './pages/LoginError';
import AnnadirJuego from './pages/AnnadirJuegos';
import ChatPage from './pages/ChatPage';
import CrearChat from './pages/CrearChat';
import PerfilUsuario from './pages/PerfilUsuario';
import ChampionGrid from './pages/ChampionGrid';
import CrearGuia from './pages/CrearGuia'
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Grid from './components/Guias/SkillsGrid'


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/juegos/listadoJuegos" element={<ListadoJuegos />} />
        <Route path="/juegos/:nombreJuego" element={<Juego />} />
        <Route path="/juegos/annadir" element={<AnnadirJuego />} />
        <Route path="/juegos/editar" element={<AnnadirJuego />} />
        <Route path="/guias/crear" element={<ChampionGrid/>}/>
        <Route path='/guias/crear/:championId' element={<CrearGuia/>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/crearChat" element={<CrearChat />} />
        <Route path="/usuario/datosUsuario" element={<PerfilUsuario />} />
        <Route path="/LoginError" element={<LoginError/>}/>
        <Route path="/grid" element={<Grid />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
