import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ArticleDetail() {
  // ✅ 1. Заменяем slug на id, чтобы совпадать с роутом бэкенда /articles/{aid}
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '' });

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/articles/${id}`);
      setArticle(response.data);
      // Предзаполняем форму редактирования
      setEditData({ title: response.data.title, content: response.data.content });
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
      // ✅ 2. Используем PUT вместо PATCH (соответствует бэкенду)
      await api.put(`/articles/${id}`, editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      fetchArticle(); // Обновляем данные после сохранения
    } catch (err) {
      alert('Ошибка при сохранении изменений');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;
    
    try {
      await api.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // ✅ 3. Возвращаемся к списку статей, а не на главную
      navigate('/articles');
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

  // Проверка прав (admin или автор статьи)
  const canEdit = user && (
    user.role === 'admin' || 
    (user.role === 'author' && article.author_id === user.id)
  );

  // ✅ 4. Безопасное форматирование даты (убирает Invalid Date)
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('ru-RU');
  };

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {isEditing ? (
        <form onSubmit={handleSave} style={{
          backgroundColor: 'var(--color-surface, #fff)',
          padding: '30px',
          borderRadius: 'var(--radius-lg, 12px)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1))'
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
                border: '1px solid var(--color-border, #ddd)',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: 'var(--font-size-lg, 1.1rem)'
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
                border: '1px solid var(--color-border, #ddd)',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: 'var(--font-size-base, 1rem)',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: '1.6'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ backgroundColor: 'var(--color-success, #27ae60)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 'var(--radius-md, 8px)', cursor: 'pointer', fontSize: 'var(--font-size-base, 1rem)' }}>Сохранить</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ backgroundColor: 'var(--color-secondary, #95a5a6)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 'var(--radius-md, 8px)', cursor: 'pointer', fontSize: 'var(--font-size-base, 1rem)' }}>Отмена</button>
          </div>
        </form>
      ) : (
        <>
          <header style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl, 2rem)', marginBottom: '10px' }}>
              {article.title}
            </h1>
            <div style={{ color: 'var(--color-text-secondary, #666)', fontSize: 'var(--font-size-sm, 0.9rem)' }}>
              {article.author_name && <span>👤 {article.author_name} | </span>}
              <span>📅 {formatDate(article.published_at || article.created_at)}</span>
            </div>
          </header>

          {canEdit && (
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={handleEdit} style={{ backgroundColor: 'var(--color-primary, #3498db)', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 'var(--radius-md, 8px)', cursor: 'pointer' }}>️ Редактировать</button>
              <button onClick={handleDelete} style={{ backgroundColor: 'var(--color-danger, #e74c3c)', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 'var(--radius-md, 8px)', cursor: 'pointer' }}>🗑️ Удалить</button>
            </div>
          )}

          <div style={{ 
            lineHeight: '1.8', 
            fontSize: 'var(--font-size-lg, 1.1rem)',
            whiteSpace: 'pre-wrap'
          }}>
            {article.content}
          </div>
        </>
      )}
    </article>
  );
}