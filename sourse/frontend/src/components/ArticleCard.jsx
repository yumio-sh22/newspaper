import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <article style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: '0 0 10px 0' }}>
        <Link to={`/article/${article.slug}`} style={{ color: '#0056b3', textDecoration: 'none' }}>
          {article.title}
        </Link>
      </h2>
      
      {article.author_name && (
        <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
          👤 {article.author_name} | 📅 {new Date(article.published_at).toLocaleDateString('ru-RU')}
        </p>
      )}
      
      <p style={{ lineHeight: '1.6', color: '#333' }}>
        {article.content.length > 200 
          ? article.content.substring(0, 200) + '...' 
          : article.content}
      </p>
      
      <Link 
        to={`/article/${article.slug}`}
        style={{
          display: 'inline-block',
          marginTop: '10px',
          color: '#0056b3',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Читать далее →
      </Link>
    </article>
  );
}