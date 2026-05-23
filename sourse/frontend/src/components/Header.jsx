import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#0056b3',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
        📰 Газета
      </Link>
      
      <nav>
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>👤 {user.full_name} ({user.role})</span>
            {user.role === 'author' && (
              <Link to="/dashboard" style={{ color: 'white' }}>Мои статьи</Link>
            )}
            <button onClick={handleLogout} style={{
              backgroundColor: 'white',
              color: '#0056b3',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Выйти
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ color: 'white' }}>Войти</Link>
        )}
      </nav>
    </header>
  );
}