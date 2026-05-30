import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ArticleCreate() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/articles', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/articles');
    } catch (err) {
      setError('Ошибка при создании статьи. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✍️ Создание новой статьи</h1>

      {error && <div style={styles.error}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Заголовок *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Введите заголовок статьи"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Содержание *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="12"
            style={styles.textarea}
            placeholder="Напишите содержание статьи..."
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Категория</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Выберите категорию</option>
            {/* Здесь можно добавить загрузку категорий из API */}
            <option value="1">Новости</option>
            <option value="2">Статьи</option>
            <option value="3">Обзоры</option>
          </select>
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={loading}
            style={{...styles.buttonPrimary, opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Создание...' : '✅ Создать статью'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/articles')}
            style={styles.buttonSecondary}
          >
            ❌ Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#2c3e50',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '0.95rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border 0.2s'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    lineHeight: '1.6'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#fff'
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  buttonPrimary: {
    flex: 2,
    padding: '0.9rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  buttonSecondary: {
    flex: 1,
    padding: '0.9rem',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  }
};