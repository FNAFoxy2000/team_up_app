import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Busqueda from './pages/Busqueda';
import Equipo from './pages/Juego';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/juego" element={<Equipo />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
