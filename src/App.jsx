import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Busqueda from './pages/Busqueda';
import Juego from './pages/Juego';
import ListadoJuegos from './pages/ListadoJuegos';
import AnnadirJuego from './pages/AnnadirJuegos';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
