import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const result = login(username, password);
    if (result.success) {
      navigate('/menu');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Geometric Jump</h1>
          <p className="login-subtitle">Salta, esquiva y conquista</p>
        </div>

        <Card className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<FaUser />}
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FaLock />}
            />

            {error && <div className="error-message">{error}</div>}

            <Button type="submit" variant="primary" fullWidth>
              Iniciar Sesión
            </Button>

            <div className="login-divider">
              <span>¿No tienes cuenta?</span>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              fullWidth
              onClick={() => navigate('/register')}
            >
              Crear Cuenta
            </Button>
          </form>

          <div className="demo-credentials">
            <p className="demo-title">Credenciales de prueba:</p>
            <code>Usuario: demo | Contraseña: demo123</code>
            <code>Usuario: player1 | Contraseña: 123456</code>
          </div>
        </Card>
      </div>

      <div className="login-background">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="geometric-shape shape-4"></div>
      </div>
    </div>
  );
};
