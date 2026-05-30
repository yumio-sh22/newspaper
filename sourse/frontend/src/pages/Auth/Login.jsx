import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch {
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Вход в систему</h2>
      
      {error && <div style={styles.error}>⚠️ {error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="user@example.com"
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{...styles.button, opacity: loading ? 0.7 : 1}}
        >
          {loading ? ' Входим...' : '🚀 Войти'}
        </button>
      </form>
      
      <p style={styles.footer}>
        Нет аккаунта? <Link to="/register" style={styles.link}>Зарегистрироваться</Link>
      </p>
    </div>
  );
}

// Стили вынесены в объект для удобства
const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
    fontSize: '1.8rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#555',
    fontSize: '0.9rem'
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border 0.2s'
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.9rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  footer: {
    marginTop: '1.5rem',
    color: '#666',
    fontSize: '0.95rem'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500'
  }
};