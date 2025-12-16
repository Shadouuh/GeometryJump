import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { useAuth } from '../../hooks/useAuth';
import './Register.css';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = register(username, email, password);
    if (result.success) {
      navigate('/menu');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Únete a la aventura</h1>
          <p className="register-subtitle">Crea tu cuenta y comienza a jugar</p>
        </div>

        <Card className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            <Input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<FaUser />}
            />

            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FaEnvelope />}
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FaLock />}
            />

            <Input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<FaLock />}
            />

            {error && <div className="error-message">{error}</div>}

            <Button type="submit" variant="primary" fullWidth>
              Crear Cuenta
            </Button>

            <div className="register-divider">
              <span>¿Ya tienes cuenta?</span>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              fullWidth
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
          </form>
        </Card>
      </div>

      <div className="register-background">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="geometric-shape shape-4"></div>
      </div>
    </div>
  );
};
