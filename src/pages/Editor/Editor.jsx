import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { EditorCanvas } from './components/EditorCanvas';
import { EditorToolbar } from './components/EditorToolbar';
import { LevelModal } from './components/LevelModal';
import { Level } from '../../game/Level';
import { useCharacter } from '../../hooks/useCharacter';
import './Editor.css';

export const Editor = () => {
  const navigate = useNavigate();
  const { selectedCharacter } = useCharacter();
  
  const [level, setLevel] = useState(() => new Level());
  const [selectedTool, setSelectedTool] = useState('block');
  const [selectedBlockType, setSelectedBlockType] = useState('default');
  const [selectedKeyType, setSelectedKeyType] = useState('circle');
  const [selectedCharacterType, setSelectedCharacterType] = useState('boxy');
  const [mode, setMode] = useState('edit'); // 'edit' o 'play'
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('save'); // 'save' o 'load'
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };
  
  const handleBlockTypeChange = (type) => {
    setSelectedBlockType(type);
  };
  
  const handleKeyTypeChange = (type) => {
    setSelectedKeyType(type);
  };
  
  const handleCharacterChange = (character) => {
    setSelectedCharacterType(character);
  };
  
  const handleBackgroundChange = (bgType) => {
    level.setBackground(bgType);
    setForceUpdate(prev => prev + 1);
  };
  
  const handleLevelSizeChange = (size) => {
    level.setSize(size);
    setForceUpdate(prev => prev + 1);
  };
  
  const handleRotateObject = () => {
    // Placeholder para rotación desde toolbar
    console.log('Rotar desde toolbar');
  };
  
  const handlePlayTest = () => {
    setMode('play');
  };
  
  const handleStopTest = () => {
    setMode('edit');
  };
  
  const handleSave = () => {
    setModalMode('save');
    setModalOpen(true);
  };
  
  const handleLoad = () => {
    setModalMode('load');
    setModalOpen(true);
  };
  
  const handleClear = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el nivel?')) {
      level.clear();
      setLevel(new Level());
    }
  };
  
  const handleLoadLevel = (jsonString) => {
    try {
      const newLevel = Level.importJSON(jsonString);
      if (newLevel) {
        setLevel(newLevel);
        return newLevel;
      }
      return null;
    } catch (error) {
      console.error('Error al cargar nivel:', error);
      return null;
    }
  };
  
  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="editor-page">
      <Header />
      
      <div className="editor-content">
        <div className="editor-header">
          <Button 
            variant="secondary" 
            icon={<FaArrowLeft />}
            onClick={() => navigate('/menu')}
          >
            Volver
          </Button>
          <h2 className="editor-title">
            {mode === 'edit' ? 'Editor de Niveles' : '🎮 Modo Prueba'}
          </h2>
          <div className="editor-mode-badge">
            {mode === 'edit' ? '✏️ Editando' : '▶️ Jugando'}
          </div>
        </div>

        <div className="editor-workspace">
          <EditorCanvas
            key={forceUpdate}
            level={level}
            selectedTool={selectedTool}
            selectedBlockType={selectedBlockType}
            selectedKeyType={selectedKeyType}
            selectedCharacterType={selectedCharacterType}
            mode={mode}
            onModeChange={handleModeChange}
            characterData={selectedCharacter}
          />
          
          {level && (
            <EditorToolbar
              selectedTool={selectedTool}
              selectedBlockType={selectedBlockType}
              selectedKeyType={selectedKeyType}
              selectedCharacter={selectedCharacterType}
              selectedBackground={level.background?.type || 'default'}
              levelSize={level.size || 'medium'}
              onToolSelect={handleToolSelect}
              onBlockTypeChange={handleBlockTypeChange}
              onKeyTypeChange={handleKeyTypeChange}
              onCharacterChange={handleCharacterChange}
              onBackgroundChange={handleBackgroundChange}
              onLevelSizeChange={handleLevelSizeChange}
              onRotateObject={handleRotateObject}
              onPlayTest={handlePlayTest}
              onStopTest={handleStopTest}
              onSave={handleSave}
              onLoad={handleLoad}
              onClear={handleClear}
              isPlaying={mode === 'play'}
            />
          )}
        </div>
      </div>
      
      <LevelModal
        isOpen={modalOpen}
        mode={modalMode}
        level={level}
        onClose={() => setModalOpen(false)}
        onSave={() => {}}
        onLoad={handleLoadLevel}
      />
    </div>
  );
};
