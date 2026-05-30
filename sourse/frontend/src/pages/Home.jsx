import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Добавляем Link для навигации
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // ✅ Запрашиваем только опубликованные статьи для главной страницы
        const response = await api.get('/articles?status=published&limit=20');
        console.log('📦 Полученные данные:', response.data);
        
        if (Array.isArray(response.data)) {
          setArticles(response.data);
        } else if (response.data && Array.isArray(response.data.items)) {
          setArticles(response.data.items);
        } else {
          console.error('Неверный формат данных:', response.data);
          setArticles([]);
        }
      } catch (error) {
        console.error('❌ Ошибка при загрузке статей:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // ✅ Безопасное форматирование даты
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Загрузка ленты...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #eee' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>📰 Газета</h1>
        {user && (
          <p style={{ margin: '0.5rem 0 0 0', color: '#7f8c8d', fontSize: '0.95rem' }}>
            Вы вошли как: <strong>{user.full_name || user.email}</strong> ({user.role})
          </p>
        )}
      </header>
      
      {articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Статей пока нет</p>
          {user?.role === 'author' || user?.role === 'admin' ? (
            <Link to="/articles/create" style={{ 
              color: '#3498db', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              ➕ Создать первую статью
            </Link>
          ) : (
            <p style={{ fontSize: '0.95rem' }}>Зайдите позже — новости появятся скоро!</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {articles.map((article) => {
            // ✅ Безопасное получение ID
            const articleId = article.id || article.article_id;
            
            return (
              // ✅ Оборачиваем всю карточку в Link — теперь можно кликнуть в любом месте
              <Link 
                key={articleId} 
                to={`/articles/${articleId}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <article 
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h2 style={{ 
                    margin: '0 0 0.75rem 0', 
                    color: '#2980b9',
                    fontSize: '1.35rem',
                    lineHeight: '1.3'
                  }}>
                    {article.title || 'Без названия'}
                  </h2>
                  
                  <p style={{ 
                    color: '#555', 
                    fontSize: '1rem', 
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {(article.content || '').substring(0, 180)}
                    {(article.content || '').length > 180 ? '...' : ''}
                  </p>
                  
                  {/* ✅ Мета-информация: дата + автор */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: '#888',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <span>
                      📅 {formatDate(article.published_at || article.created_at) || 'Дата не указана'}
                    </span>
                    {article.author_name && (
                      <span style={{ color: '#666' }}>
                        ✍️ {article.author_name}
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}