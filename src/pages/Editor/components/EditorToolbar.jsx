import { useState } from 'react';
import { 
  FaCube, FaCaretUp, FaDoorOpen, FaMapMarkerAlt, FaEraser, FaPlay, FaStop, 
  FaSave, FaFolderOpen, FaTrash, FaCoins, FaSyncAlt, FaPalette, FaExpand,
  FaMountain, FaSnowflake, FaIndustry, FaTree, FaWater, FaFire, FaKey, FaLock,
  FaSkull, FaExchangeAlt, FaSquare, FaCircle
} from 'react-icons/fa';
import { Button } from '../../../components/Button/Button';
import { Background } from '../../../game/Background';
import './EditorToolbar.css';

export const EditorToolbar = ({ 
  selectedTool,
  selectedBlockType,
  selectedKeyType,
  selectedCharacter,
  selectedBackground,
  levelSize,
  onToolSelect,
  onBlockTypeChange,
  onKeyTypeChange,
  onCharacterChange,
  onBackgroundChange,
  onLevelSizeChange,
  onRotateObject,
  onPlayTest,
  onStopTest,
  onSave,
  onLoad,
  onClear,
  isPlaying 
}) => {
  const [showBlockTypes, setShowBlockTypes] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  
  const tools = [
    { id: 'block', name: 'Bloque', icon: <FaCube />, color: '#3c3c50' },
    { id: 'spike', name: 'Pincho', icon: <FaCaretUp />, color: '#c83232' },
    { id: 'water', name: 'Agua', icon: <FaWater />, color: '#3278c8' },
    { id: 'lava', name: 'Lava', icon: <FaFire />, color: '#c83200' },
    { id: 'falling_block', name: 'Bloque Frágil', icon: <FaCube />, color: '#c84632' },
    { id: 'coin', name: 'Moneda', icon: <FaCoins />, color: '#ffd700' },
    { id: 'key', name: 'Llave', icon: <FaKey />, color: '#64c8ff' },
    { id: 'locked_door', name: 'Puerta Bloqueada', icon: <FaLock />, color: '#ffc864' },
    { id: 'enemy', name: 'Enemigo', icon: <FaSkull />, color: '#c83264' },
    { id: 'character_gate', name: 'Pasadizo', icon: <FaSquare />, color: '#6496ff' },
    { id: 'switch_platform', name: 'Cambio de Personaje', icon: <FaExchangeAlt />, color: '#9664ff' },
    { id: 'spawn', name: 'Inicio', icon: <FaMapMarkerAlt />, color: '#6464ff' },
    { id: 'door', name: 'Puerta', icon: <FaDoorOpen />, color: '#64c864' },
    { id: 'erase', name: 'Borrar', icon: <FaEraser />, color: '#646464' },
  ];
  
  const blockTypes = [
    { id: 'default', name: 'Clásico', icon: <FaCube />, color: '#3c3c50' },
    { id: 'stone', name: 'Piedra', icon: <FaMountain />, color: '#5a5a5a' },
    { id: 'metal', name: 'Metal', icon: <FaIndustry />, color: '#96a8c8' },
    { id: 'ice', name: 'Hielo', icon: <FaSnowflake />, color: '#c8e6ff' },
    { id: 'wood', name: 'Madera', icon: <FaTree />, color: '#8b5a3c' },
  ];
  
  const backgrounds = Background.getAvailableTypes();
  
  const levelSizes = [
    { id: 'small', name: 'Pequeño', width: '800x600' },
    { id: 'medium', name: 'Mediano', width: '1600x600' },
    { id: 'large', name: 'Grande', width: '2400x800' },
  ];
  
  return (
    <div className="editor-toolbar">
      {/* Herramientas Principales */}
      <div className="toolbar-section">
        <h3 className="toolbar-title">🛠️ Herramientas</h3>
        <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-button ${selectedTool === tool.id ? 'tool-active' : ''}`}
              onClick={() => onToolSelect(tool.id)}
              style={{
                '--tool-color': tool.color
              }}
              title={tool.name}
              disabled={isPlaying}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name" style={{ fontSize: '10px' }}>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="toolbar-divider"></div>
      
      {/* Tipo de Bloque */}
      {selectedTool === 'block' && (
        <>
          <div className="toolbar-section">
            <h3 className="toolbar-title">🧱 Tipo de Bloque</h3>
            <div className="block-type-grid">
              {blockTypes.map(type => (
                <button
                  key={type.id}
                  className={`block-type-button ${selectedBlockType === type.id ? 'active' : ''}`}
                  onClick={() => onBlockTypeChange(type.id)}
                  style={{ '--type-color': type.color }}
                  title={type.name}
                  disabled={isPlaying}
                >
                  <span className="block-icon">{type.icon}</span>
                  <span className="block-label">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="toolbar-divider"></div>
        </>
      )}
      
      {/* Rotación para Pinchos */}
      {selectedTool === 'spike' && (
        <>
          <div className="toolbar-section">
            <h3 className="toolbar-title">🔄 Rotación</h3>
            <button
              className="rotate-button"
              onClick={onRotateObject}
              disabled={isPlaying}
              title="Rotar objeto seleccionado"
            >
              <FaSyncAlt />
              <span>Rotar</span>
            </button>
            <div className="rotate-info">
              Doble click en un pincho para rotarlo
            </div>
          </div>
          <div className="toolbar-divider"></div>
        </>
      )}
      
      {/* Tipo de Llave/Puerta */}
      {(selectedTool === 'key' || selectedTool === 'locked_door') && (
        <>
          <div className="toolbar-section">
            <h3 className="toolbar-title">🔑 Forma</h3>
            <div className="block-type-grid">
              <button
                className={`block-type-button ${selectedKeyType === 'circle' ? 'active' : ''}`}
                onClick={() => onKeyTypeChange('circle')}
                disabled={isPlaying}
                title="Círculo"
              >
                <span className="block-icon"><FaCircle /></span>
                <span className="block-label">Círculo</span>
              </button>
              <button
                className={`block-type-button ${selectedKeyType === 'square' ? 'active' : ''}`}
                onClick={() => onKeyTypeChange('square')}
                disabled={isPlaying}
                title="Cuadrado"
              >
                <span className="block-icon"><FaSquare /></span>
                <span className="block-label">Cuadrado</span>
              </button>
              <button
                className={`block-type-button ${selectedKeyType === 'triangle' ? 'active' : ''}`}
                onClick={() => onKeyTypeChange('triangle')}
                disabled={isPlaying}
                title="Triángulo"
              >
                <span className="block-icon">▲</span>
                <span className="block-label">Triángulo</span>
              </button>
            </div>
          </div>
          <div className="toolbar-divider"></div>
        </>
      )}
      
      {/* Personaje requerido para Character Gate */}
      {selectedTool === 'character_gate' && (
        <>
          <div className="toolbar-section">
            <h3 className="toolbar-title">👤 Personaje</h3>
            <div className="block-type-grid">
              <button
                className={`block-type-button ${selectedCharacter === 'boxy' ? 'active' : ''}`}
                onClick={() => onCharacterChange('boxy')}
                disabled={isPlaying}
                title="Boxy"
              >
                <span className="block-icon"><FaSquare /></span>
                <span className="block-label">Boxy</span>
              </button>
              <button
                className={`block-type-button ${selectedCharacter === 'isquio' ? 'active' : ''}`}
                onClick={() => onCharacterChange('isquio')}
                disabled={isPlaying}
                title="Isquio"
              >
                <span className="block-icon">▲</span>
                <span className="block-label">Isquio</span>
              </button>
              <button
                className={`block-type-button ${selectedCharacter === 'gordo' ? 'active' : ''}`}
                onClick={() => onCharacterChange('gordo')}
                disabled={isPlaying}
                title="Gordo"
              >
                <span className="block-icon"><FaCircle /></span>
                <span className="block-label">Gordo</span>
              </button>
            </div>
          </div>
          <div className="toolbar-divider"></div>
        </>
      )}
      
      {/* Tamaño del Nivel */}
      <div className="toolbar-section">
        <h3 className="toolbar-title">📏 Tamaño</h3>
        <div className="size-buttons">
          {levelSizes.map(size => (
            <button
              key={size.id}
              className={`size-button ${levelSize === size.id ? 'active' : ''}`}
              onClick={() => onLevelSizeChange(size.id)}
              disabled={isPlaying}
              title={size.width}
            >
              <FaExpand />
              <div>
                <div className="size-name">{size.name}</div>
                <div className="size-dims">{size.width}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="toolbar-divider"></div>
      
      {/* Fondo */}
      <div className="toolbar-section">
        <h3 className="toolbar-title">🎨 Fondo</h3>
        <div className="background-selector">
          {backgrounds.map(bg => (
            <button
              key={bg.id}
              className={`background-button ${selectedBackground === bg.id ? 'active' : ''}`}
              onClick={() => onBackgroundChange(bg.id)}
              disabled={isPlaying}
              title={bg.description}
            >
              <div className="bg-preview" data-bg={bg.id}></div>
              <span className="bg-name">{bg.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="toolbar-divider"></div>
      
      {/* Acciones */}
      <div className="toolbar-section">
        <h3 className="toolbar-title">⚡ Acciones</h3>
        <div className="action-buttons">
          {!isPlaying ? (
            <Button 
              variant="primary" 
              icon={<FaPlay />}
              onClick={onPlayTest}
              fullWidth
            >
              Probar Nivel
            </Button>
          ) : (
            <Button 
              variant="danger" 
              icon={<FaStop />}
              onClick={onStopTest}
              fullWidth
            >
              Detener
            </Button>
          )}
          
          <Button 
            variant="secondary" 
            icon={<FaSave />}
            onClick={onSave}
            fullWidth
            disabled={isPlaying}
          >
            Guardar
          </Button>
          
          <Button 
            variant="secondary" 
            icon={<FaFolderOpen />}
            onClick={onLoad}
            fullWidth
            disabled={isPlaying}
          >
            Cargar
          </Button>
          
          <Button 
            variant="secondary" 
            icon={<FaTrash />}
            onClick={onClear}
            fullWidth
            disabled={isPlaying}
          >
            Limpiar
          </Button>
        </div>
      </div>
      
      {/* Tips */}
      <div className="toolbar-tips">
        <div className="tip">
          <strong>💡 Atajos:</strong>
        </div>
        <div className="tip-item">• <kbd>Click izq.</kbd> Colocar</div>
        <div className="tip-item">• <kbd>Click der.</kbd> Borrar</div>
        <div className="tip-item">• <kbd>Doble click</kbd> Rotar pincho</div>
        <div className="tip-item">• <kbd>E</kbd> Cambiar personaje</div>
        <div className="tip-item">• <kbd>ESC</kbd> Volver al editor</div>
        <div className="tip-item">• <kbd>←→</kbd> Mover</div>
        <div className="tip-item">• <kbd>SPACE</kbd> Saltar</div>
      </div>
    </div>
  );
};
