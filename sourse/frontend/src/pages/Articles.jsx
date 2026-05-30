import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Запрашиваем ВСЕ статьи автора (включая черновики), чтобы сразу видеть результат создания
    fetchArticles('all'); 
  }, []);

  const fetchArticles = async (status = 'published') => {
    try {
      setLoading(true);
      const response = await api.get(`/articles?status=${status}&limit=50`);
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Загружено статей:', data.length, data); // Для отладки
      setArticles(data);
    } catch (err) {
      console.error(' Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !confirm('Удалить статью?')) return;
    try {
      await api.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchArticles('all');
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const safeDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—';

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📰 Мои статьи</h1>
        <Link to="/articles/create" style={styles.createButton}>➕ Создать</Link>
      </div>

      {articles.length === 0 ? (
        <div style={styles.empty}>
          <p>Статей пока нет</p>
          <Link to="/articles/create" style={styles.link}>Создать первую</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {articles.map((art) => {
            // 🔑 БЕЗОПАСНОЕ ПОЛУЧЕНИЕ ID (убирает undefined)
            const articleId = art.id || art.article_id || art.slug;
            
            return (
              <div key={articleId || Math.random()} style={styles.card}>
                <h3 style={styles.cardTitle}>{art.title || 'Без названия'}</h3>
                <p style={styles.cardContent}>{(art.content || '').slice(0, 120)}...</p>
                <div style={styles.cardMeta}>
                  <span>📅 {safeDate(art.published_at || art.created_at)}</span>
                  <span style={{color: art.status === 'draft' ? '#e67e22' : '#27ae60'}}>
                    {art.status === 'draft' ? '📝 Черновик' : '✅ Опубликовано'}
                  </span>
                </div>
                <div style={styles.cardActions}>
                  <Link to={`/articles/${articleId}`} style={styles.buttonView}>👁 Просмотр</Link>
                  <Link to={`/articles/${articleId}/edit`} style={styles.buttonEdit}>✏️ Изменить</Link>
                  <button onClick={() => handleDelete(articleId)} style={styles.buttonDelete}>️ Удалить</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0
  },
  createButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'background 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    color: '#2c3e50'
  },
  cardContent: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '1rem'
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  buttonView: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    flex: 1,
    textAlign: 'center'
  },
  buttonEdit: {
    backgroundColor: '#f39c12',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    flex: 1,
    textAlign: 'center'
  },
  buttonDelete: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    flex: 1
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666'
  }
};