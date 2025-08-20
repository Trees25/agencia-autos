import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/admin');
  };

  return (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="p-4 rounded shadow" style={{ width: "350px", backgroundColor: "white" }}>
      <h2 className="text-center mb-4">Ingreso de administrador</h2>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  </div>
);
}
