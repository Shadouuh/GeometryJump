import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay } from 'react-icons/fa';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import './Story.css';

export const Story = () => {
  const navigate = useNavigate();

  const levels = [
    { id: 1, name: 'Primer Salto', difficulty: 'Fácil', completed: false },
    { id: 2, name: 'El Abismo', difficulty: 'Media', completed: false, locked: true },
    { id: 3, name: 'Montañas Flotantes', difficulty: 'Difícil', completed: false, locked: true },
    { id: 4, name: 'El Vacío', difficulty: 'Experto', completed: false, locked: true },
  ];

  const nodes = [
    { id: 1, x: 16, y: 72 },
    { id: 2, x: 36, y: 48 },
    { id: 3, x: 62, y: 58 },
    { id: 4, x: 82, y: 30 }
  ];

  const getNode = (levelId) => nodes.find(n => n.id === levelId);

  return (
    <div className="story-page">
      <Header />
      
      <div className="story-content">
        <div className="story-header">
          <Button 
            variant="secondary" 
            icon={<FaArrowLeft />}
            onClick={() => navigate('/menu')}
          >
            Volver
          </Button>
          <h2 className="story-title">Modo Historia</h2>
        </div>

        <div className="story-map">
          <div className="map-surface">
            <svg className="map-paths" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 16 72 C 26 64, 30 56, 36 48" />
              <path d="M 36 48 C 44 44, 54 54, 62 58" />
              <path d="M 62 58 C 70 56, 76 42, 82 30" />
            </svg>

            {levels.map((level) => {
              const node = getNode(level.id);
              const isLocked = !!level.locked;
              return (
                <div
                  key={level.id}
                  className={`map-node ${isLocked ? 'map-node-locked' : 'map-node-open'}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="node-pulse" />

                  <div className="node-dot">
                    <span className="node-number">{level.id}</span>
                  </div>

                  <Card className={`node-card ${isLocked ? 'node-card-locked' : ''}`} hover={!isLocked}>
                    <div className="node-title">{level.name}</div>
                    <div className="node-subtitle">Dificultad: <span>{level.difficulty}</span></div>
                    {isLocked ? (
                      <div className="node-locked">🔒 Completa el nivel anterior</div>
                    ) : (
                      <Button variant="primary" icon={<FaPlay />} fullWidth>
                        Jugar
                      </Button>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <div className="coming-soon">
          <p>🎮 Niveles en desarrollo - ¡Próximamente!</p>
        </div>
      </div>
    </div>
  );
};
