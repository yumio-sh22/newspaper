import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/articles/${slug}`);
      setArticle(response.data);
    } catch (err) {
      setError('Статья не найдена');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditData({ title: article.title, content: article.content });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/articles/${article.id}`, editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      fetchArticle();
    } catch (err) {
      alert('Ошибка при сохранении изменений');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;
    
    try {
      await api.delete(`/articles/${article.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/');
    } catch (err) {
      alert('Ошибка при удалении статьи');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>❌ {error || 'Статья не найдена'}</h1>
        <button onClick={() => navigate('/')} style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }}>
          Вернуться на главную
        </button>
      </div>
    );
  }

  const canEdit = user && (
    user.role === 'admin' || 
    user.role === 'editor' || 
    (user.role === 'author' && article.author_id === user.id)
  );

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {isEditing ? (
        <form onSubmit={handleSave} style={{
          backgroundColor: 'var(--color-surface)',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2>Редактирование статьи</h2>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Заголовок:
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Содержание:
            </label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              required
              rows="12"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: '1.6'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
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
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)'
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <>
          <header style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '10px' }}>
              {article.title}
            </h1>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {article.author_name && <span>👤 {article.author_name} | </span>}
              <span>📅 {new Date(article.published_at || article.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
          </header>

          {canEdit && (
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleEdit}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                ✏️ Редактировать
              </button>
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                🗑️ Удалить
              </button>
            </div>
          )}

          <div style={{ 
            lineHeight: '1.8', 
            fontSize: 'var(--font-size-lg)',
            whiteSpace: 'pre-wrap'
          }}>
            {article.content}
          </div>
        </>
      )}
    </article>
  );
}