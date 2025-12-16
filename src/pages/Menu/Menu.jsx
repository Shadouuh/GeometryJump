import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaHammer, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { useCharacter } from '../../hooks/useCharacter';
import { CharacterPreview } from './components/CharacterPreview';
import './Menu.css';

export const Menu = () => {
  const { selectedCharacter, allCharacters, selectCharacter } = useCharacter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const index = allCharacters.findIndex(char => char.id === selectedCharacter.id);
    setCurrentIndex(index);
  }, [selectedCharacter, allCharacters]);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? allCharacters.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    selectCharacter(allCharacters[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = currentIndex === allCharacters.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    selectCharacter(allCharacters[newIndex].id);
  };

  return (
    <div className="menu-page">
      <Header />
      
      <div className="menu-content">
        <div className="menu-title-section">
          <h2 className="menu-title">Selecciona tu personaje</h2>
          <p className="menu-subtitle">Cada forma tiene habilidades únicas</p>
        </div>

        <div className="character-selection">
          <button className="nav-button nav-left" onClick={handlePrevious}>
            <FaChevronLeft />
          </button>

          <div className="character-display">
            <CharacterPreview character={allCharacters[currentIndex]} />
            
            <div className="character-info">
              <h3 className="character-name">{allCharacters[currentIndex].name}</h3>
              <p className="character-description">{allCharacters[currentIndex].description}</p>
              
              <div className="character-stats">
                <div className="stat">
                  <span className="stat-label">Velocidad</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ 
                        width: `${allCharacters[currentIndex].stats.speed * 10}%`,
                        background: allCharacters[currentIndex].color 
                      }}
                    />
                  </div>
                  <span className="stat-value">{allCharacters[currentIndex].stats.speed}/10</span>
                </div>
                
                <div className="stat">
                  <span className="stat-label">Salto</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ 
                        width: `${allCharacters[currentIndex].stats.jump * 10}%`,
                        background: allCharacters[currentIndex].color 
                      }}
                    />
                  </div>
                  <span className="stat-value">{allCharacters[currentIndex].stats.jump}/10</span>
                </div>
              </div>
            </div>
          </div>

          <button className="nav-button nav-right" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        <div className="character-dots">
          {allCharacters.map((char, index) => (
            <button
              key={char.id}
              className={`dot ${index === currentIndex ? 'dot-active' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                selectCharacter(char.id);
              }}
              style={{
                background: index === currentIndex ? char.color : 'rgba(255, 255, 255, 0.2)'
              }}
            />
          ))}
        </div>

        <div className="menu-actions">
          <Card className="menu-card" hover>
            <Button 
              variant="primary" 
              icon={<FaBook />}
              onClick={() => navigate('/story')}
              fullWidth
            >
              Modo Historia
            </Button>
            <p className="card-description">Aventúrate en niveles desafiantes</p>
          </Card>

          <Card className="menu-card" hover>
            <Button 
              variant="secondary" 
              icon={<FaHammer />}
              onClick={() => navigate('/editor')}
              fullWidth
            >
              Editor de Niveles
            </Button>
            <p className="card-description">Crea tus propios desafíos</p>
          </Card>

          <Card className="menu-card" hover>
            <Button 
              variant="secondary" 
              icon={<FaUsers />}
              onClick={() => navigate('/community')}
              fullWidth
            >
              Niveles de la Comunidad
            </Button>
            <p className="card-description">Juega creaciones de otros jugadores</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
