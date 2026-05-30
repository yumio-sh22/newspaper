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
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Логотип / Название */}
        <Link to="/" style={styles.logo}>
          📰 Газета
        </Link>

        {/* Навигация */}
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Главная</Link>
          
          {/* Показываем "Статьи" только авторам и админам */}
          {(user?.role === 'admin' || user?.role === 'author') && (
            <Link to="/articles" style={styles.navLink}>Мои статьи</Link>
          )}
          
          {/* Админ видит управление пользователями */}
          {user?.role === 'admin' && (
            <Link to="/admin" style={styles.navLink}>Админ-панель</Link>
          )}
        </nav>

        {/* Правая часть: пользователь или вход */}
        <div style={styles.auth}>
          {user ? (
            <>
              <span style={styles.username}>
                👤 {user.full_name || user.email}
                {user.role && <span style={styles.role}>({user.role})</span>}
              </span>
              <button onClick={handleLogout} style={styles.button}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Войти</Link>
              <Link to="/register">
                <button style={styles.buttonPrimary}>Регистрация</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Простые inline-стили (можно вынести в CSS позже)
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.2s',
  },
  auth: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    color: '#ecf0f1',
    fontSize: '0.9rem',
  },
  role: {
    color: '#3498db',
    marginLeft: '0.3rem',
    fontSize: '0.8rem',
  },
  button: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
};