import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCharacter } from '../../hooks/useCharacter';
import './Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { selectedCharacter } = useCharacter();

  const characterSymbol = selectedCharacter?.type === 'square' ? '□'
    : selectedCharacter?.type === 'circle' ? '○'
      : selectedCharacter?.type === 'isosceles' || selectedCharacter?.type === 'triangle' ? '△'
        : '◆';

  const username = user?.username || 'Jugador';
  const avatarLetter = (username?.charAt(0) || '?').toUpperCase();
  const characterName = selectedCharacter?.name || '—';
  const characterColor = selectedCharacter?.color || '#8b5cf6';

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Geometric Jump</h1>
      </div>
      
      <div className="header-right">
        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            {avatarLetter}
          </div>

          <div className="profile-info">
            <div className="profile-top">
              <span className="profile-name">{username}</span>
              <span className="profile-status">
                <span className="status-dot" aria-hidden="true" />
                Online
              </span>
            </div>

            <div className="profile-bottom">
              <span className="character-chip" style={{ '--chipColor': characterColor }}>
                <span className="chip-symbol" aria-hidden="true">{characterSymbol}</span>
                <span className="chip-name">{characterName}</span>
              </span>
            </div>
          </div>
        </div>
        
        <button className="logout-btn" onClick={logout} title="Cerrar sesión">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};
