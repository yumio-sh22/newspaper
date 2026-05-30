import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'reader'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await register(formData);
      if (success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Ошибка регистрации. Email уже занят или неверные данные.');
      }
    } catch {
      setError('Ошибка подключения к серверу');
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={styles.title}>Регистрация успешна!</h2>
        <p style={styles.text}>Перенаправляем на страницу входа...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Регистрация</h2>
      
      {error && <div style={styles.error}>⚠️ {error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Пароль (мин. 6 символов):</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Полное имя:</label>
          <input name="full_name" type="text" value={formData.full_name} onChange={handleChange} required style={styles.input} placeholder="Иван Иванов" />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Роль:</label>
          <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
            <option value="reader">👁 Читатель</option>
            <option value="author">✍️ Автор</option>
            <option value="admin">⚙️ Администратор</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
          {loading ? '⏳ Регистрируем...' : '🚀 Зарегистрироваться'}
        </button>
      </form>
      
      <p style={styles.footer}>
        Уже есть аккаунт? <Link to="/login" style={styles.link}>Войти</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '450px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  title: { marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.8rem' },
  successIcon: { fontSize: '3rem', marginBottom: '1rem' },
  text: { color: '#555', fontSize: '1.1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: '500', color: '#555', fontSize: '0.9rem' },
  input: { padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' },
  button: { marginTop: '0.5rem', padding: '0.9rem', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  footer: { marginTop: '1.5rem', color: '#666', fontSize: '0.95rem' },
  link: { color: '#3498db', textDecoration: 'none', fontWeight: '500' }
};