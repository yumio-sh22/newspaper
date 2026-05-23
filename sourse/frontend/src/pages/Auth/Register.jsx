import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: 'reader'
      });

      console.log('Регистрация успешна:', response.data);
      
      // Автоматический вход после регистрации
      const loginResponse = await api.post('/auth/login', null, {
        params: {
          email: formData.email,
          password: formData.password
        }
      });

      localStorage.setItem('token', loginResponse.data.access_token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      // Перенаправление на главную
      navigate('/');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      if (err.response?.status === 400) {
        setError('Этот email уже зарегистрирован');
      } else {
        setError('Ошибка при регистрации. Проверьте данные и попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ 
          margin: '0 0 30px 0', 
          textAlign: 'center',
          color: '#333'
        }}>
          Регистрация
        </h2>

        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#ffe6e6',
            color: '#d32f2f',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              ФИО:
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="example@mail.ru"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              Пароль:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Минимум 6 символов"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#999' : '#0056b3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          color: '#666'
        }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ 
            color: '#0056b3', 
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
