import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from './pages/Login';
import Admin from './pages/Admin';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './components/NotFoundPage';
import Navbar from './components/Navbar'; // <-- Importa tu Navbar

function App() {
  return (
    <Router>
      {/* Navbar global */}
      <Navbar />

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Rutas Privadas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
