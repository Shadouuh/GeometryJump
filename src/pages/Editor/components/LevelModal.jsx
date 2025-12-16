import { useState } from 'react';
import { FaTimes, FaDownload, FaUpload, FaCheck } from 'react-icons/fa';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import './LevelModal.css';

export const LevelModal = ({ isOpen, mode, level, onClose, onSave, onLoad }) => {
  const [levelName, setLevelName] = useState(level?.name || '');
  const [authorName, setAuthorName] = useState(level?.author || '');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  if (!isOpen) return null;
  
  const handleExport = () => {
    try {
      level.name = levelName || 'Nivel Sin Nombre';
      level.author = authorName || 'Anónimo';
      
      const jsonString = level.exportJSON();
      
      // Crear y descargar archivo
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${level.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('¡Nivel exportado correctamente!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError('Error al exportar el nivel');
    }
  };
  
  const handleImport = () => {
    try {
      setError('');
      
      if (!jsonInput.trim()) {
        setError('Por favor pega el JSON del nivel');
        return;
      }
      
      const importedLevel = onLoad(jsonInput);
      
      if (importedLevel) {
        setSuccess('¡Nivel cargado correctamente!');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000);
      } else {
        setError('JSON inválido o corrupto');
      }
    } catch (err) {
      setError('Error al importar el nivel: ' + err.message);
    }
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonInput(event.target.result);
      };
      reader.readAsText(file);
    }
  };
  
  const copyToClipboard = () => {
    const jsonString = level.exportJSON();
    navigator.clipboard.writeText(jsonString);
    setSuccess('¡JSON copiado al portapapeles!');
    setTimeout(() => setSuccess(''), 2000);
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'save' ? 'Guardar Nivel' : 'Cargar Nivel'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {mode === 'save' && (
            <>
              <Input
                label="Nombre del Nivel"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="Mi nivel épico"
              />
              
              <Input
                label="Autor"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Tu nombre"
              />
              
              <div className="json-preview">
                <label className="input-label">Vista Previa JSON</label>
                <div className="json-box">
                  <pre>{level.exportJSON()}</pre>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={copyToClipboard}
                  icon={<FaCheck />}
                >
                  Copiar JSON
                </Button>
              </div>
            </>
          )}
          
          {mode === 'load' && (
            <>
              <div className="file-upload-section">
                <label className="input-label">Cargar desde archivo</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              </div>
              
              <div className="json-input-section">
                <label className="input-label">O pega el JSON aquí</label>
                <textarea
                  className="json-textarea"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"name": "Mi Nivel", "author": "..."}'
                  rows={10}
                />
              </div>
            </>
          )}
          
          {error && <div className="modal-error">{error}</div>}
          {success && <div className="modal-success">{success}</div>}
        </div>
        
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          
          {mode === 'save' ? (
            <Button 
              variant="primary" 
              icon={<FaDownload />}
              onClick={handleExport}
            >
              Exportar JSON
            </Button>
          ) : (
            <Button 
              variant="primary" 
              icon={<FaUpload />}
              onClick={handleImport}
            >
              Importar Nivel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
