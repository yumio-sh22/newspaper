import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        console.log('Полученные данные:', response.data); // Для отладки
        
        // Проверяем, что данные - это массив
        if (Array.isArray(response.data)) {
          setArticles(response.data);
        } else if (response.data && Array.isArray(response.data.items)) {
          // Если данные вложены в свойство items
          setArticles(response.data.items);
        } else {
          console.error('Неверный формат данных:', response.data);
          setArticles([]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Газета {user ? `| ${user.full_name} (${user.role})` : ''}</h1>
      
      {articles.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Статей пока нет
        </p>
      ) : (
        articles.map((article) => (
          <article 
            key={article.id} 
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              backgroundColor: 'white'
            }}
          >
            <h2 style={{ margin: '0 0 10px 0' }}>{article.title}</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
              {article.content.length > 150 
                ? article.content.substring(0, 150) + '...' 
                : article.content}
            </p>
          </article>
        ))
      )}
    </div>
  );
}