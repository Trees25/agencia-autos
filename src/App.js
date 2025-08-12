import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Catalogo from './pages/Catalogo';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
     <Navbar /> {/* ⬅️ Agregado aquí */}
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
