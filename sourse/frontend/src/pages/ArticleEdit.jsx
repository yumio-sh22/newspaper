import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ArticleEdit() {
  const { id } = useParams(); // ✅ Берем id из URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/articles/${id}`);
      const article = response.data;
      setFormData({
        title: article.title || '',
        content: article.content || '',
      });
    } catch (err) {
      console.error('Ошибка загрузки статьи:', err);
      setError('Не удалось загрузить статью');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // ✅ Используем PUT метод (как мы добавили на бэкенде)
      await api.put(`/articles/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // ✅ После успешного сохранения переходим на страницу просмотра
      // Используем тот же id
      navigate(`/articles/${id}`);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError('Ошибка при сохранении изменений: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка статьи...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✏️ Редактирование статьи</h1>

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
          />
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={saving}
            style={{...styles.buttonPrimary, opacity: saving ? 0.7 : 1}}
          >
            {saving ? '💾 Сохранение...' : '💾 Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/articles/${id}`)}
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
    fontSize: '1rem'
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
  buttons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  buttonPrimary: {
    flex: 2,
    padding: '0.9rem',
    backgroundColor: '#3498db',
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
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666'
  }
};