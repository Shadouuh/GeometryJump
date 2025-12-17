import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import './Community.css';
import { EditorCanvas } from '../Editor/components/EditorCanvas';
import { Level } from '../../game/Level';
import { useCharacter } from '../../hooks/useCharacter';

export const Community = () => {
  const navigate = useNavigate();
  const { selectedCharacter } = useCharacter();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [playing, setPlaying] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentName, setCurrentName] = useState('');
  
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setError('');
        setLoading(true);
        const resp = await fetch(`${apiBase}/levels/list.php`, { method: 'GET' });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data.success) {
          console.error('List levels failed', { status: resp.status, data });
          throw new Error(data.error || 'No se pudo cargar niveles');
        }
        console.log('List levels success', data);
        if (mounted) setLevels(data.levels || []);
      } catch (e) {
        console.error('List levels error', e);
        if (mounted) setError(e.message || 'Error cargando niveles');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);
  
  const playLevel = async (id, name) => {
    try {
      setError('');
      const resp = await fetch(`${apiBase}/levels/get.php?id=${encodeURIComponent(id)}`, { method: 'GET' });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.success || !data.level?.json) {
        throw new Error(data.error || 'No se pudo obtener el nivel');
      }
      const jsonString = data.level.json;
      const lvl = Level.importJSON(jsonString);
      if (!lvl) {
        throw new Error('JSON inválido del nivel');
      }
      setCurrentLevel(lvl);
      setCurrentName(name || data.level.name || 'Nivel');
      setPlaying(true);
    } catch (e) {
      setError(e.message || 'Error al preparar el nivel');
    }
  };
  
  const handleModeChange = (newMode) => {
    if (newMode === 'edit') {
      setPlaying(false);
      setCurrentLevel(null);
    }
  };

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

        {loading && (
          <div className="coming-soon-box">
            <div className="construction-icon">⌛</div>
            <h3>Cargando niveles...</h3>
            <p>Obteniendo los mapas de la comunidad</p>
          </div>
        )}
        
        {!loading && error && (
          <div className="coming-soon-box">
            <div className="construction-icon">⚠️</div>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {levels.length === 0 ? (
              <div className="coming-soon-box">
                <div className="construction-icon">🌐</div>
                <h3>Sin niveles por ahora</h3>
                <p>Cuando los jugadores suban niveles, aparecerán aquí.</p>
              </div>
            ) : (
              <div className="levels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {levels.map(l => (
                  <div key={l.id} className="level-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                    <div className="level-name" style={{ fontWeight: 700, color: 'white', fontSize: '18px' }}>{l.name}</div>
                    <div className="level-author" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>Autor: {l.author}</div>
                    <div className="level-date" style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontSize: '12px' }}>{l.created_at}</div>
                    <div style={{ marginTop: '12px' }}>
                      <Button variant="primary" onClick={() => playLevel(l.id, l.name)}>
                        Jugar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {playing && currentLevel && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'white', fontWeight: 700 }}>{currentName}</div>
              <Button variant="secondary" onClick={() => handleModeChange('edit')}>Cerrar</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0, padding: '12px' }}>
              <EditorCanvas
                level={currentLevel}
                selectedTool={'block'}
                selectedBlockType={'default'}
                selectedKeyType={'circle'}
                selectedCharacterType={'boxy'}
                mode={'play'}
                onModeChange={handleModeChange}
                characterData={selectedCharacter}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
