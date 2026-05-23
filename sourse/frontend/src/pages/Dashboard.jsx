import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ArticleCard from '../components/ArticleCard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'all'
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchArticles();
  }, [user, activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'my' 
        ? `/articles?author_id=${user.id}`
        : '/articles?limit=100';
      const response = await api.get(endpoint);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/articles', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowForm(false);
      setFormData({ title: '', content: '' });
      fetchArticles();
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Ошибка при создании статьи');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;
    
    try {
      await api.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Ошибка при удалении статьи');
    }
  };

  if (!user || !['author', 'editor', 'admin'].includes(user.role)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>❌ Доступ запрещён</h1>
        <p>Только авторы, редакторы и администраторы могут использовать панель управления</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>📊 Панель управления</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-base)'
          }}
        >
          {showForm ? 'Отмена' : '+ Новая статья'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'var(--color-surface)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '30px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2>Создание новой статьи</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Заголовок:
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Содержание:
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="8"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--color-success)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-base)'
            }}
          >
            Опубликовать
          </button>
        </form>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('my')}
          style={{
            backgroundColor: activeTab === 'my' ? 'var(--color-primary)' : 'var(--color-secondary)',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Мои статьи
        </button>
        {user.role === 'editor' || user.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('all')}
            style={{
              backgroundColor: activeTab === 'all' ? 'var(--color-primary)' : 'var(--color-secondary)',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            Все статьи
          </button>
        ) : null}
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : articles.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          {activeTab === 'my' ? 'У вас пока нет статей' : 'Статей пока нет'}
        </p>
      ) : (
        <div>
          {articles.map(article => (
            <div key={article.id} style={{ position: 'relative', marginBottom: '20px' }}>
              <ArticleCard article={article} />
              <button
                onClick={() => handleDelete(article.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}