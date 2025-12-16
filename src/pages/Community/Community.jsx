import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import './Community.css';

export const Community = () => {
  const navigate = useNavigate();

  return (
    <div className="community-page">
      <Header />
      
      <div className="community-content">
        <div className="community-header">
          <Button 
            variant="secondary" 
            icon={<FaArrowLeft />}
            onClick={() => navigate('/menu')}
          >
            Volver
          </Button>
          <h2 className="community-title">Niveles de la Comunidad</h2>
        </div>

        <div className="coming-soon-box">
          <div className="construction-icon">🌐</div>
          <h3>Próximamente</h3>
          <p>La sección de comunidad estará disponible pronto</p>
          <p className="features-list">
            Lo que podrás hacer:
          </p>
          <ul>
            <li>🎯 Explorar niveles creados por otros jugadores</li>
            <li>⭐ Calificar y comentar niveles</li>
            <li>🏆 Ver rankings y récords</li>
            <li>👥 Seguir a tus creadores favoritos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
