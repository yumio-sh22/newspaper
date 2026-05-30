// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';  // Убрали BrowserRouter
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Articles from './pages/Articles';
import ArticleCreate from './pages/ArticleCreate';
import ArticleEdit from './pages/ArticleEdit';
import ArticleDetail from './pages/ArticleDetail';

// Компонент для защиты маршрутов
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      Доступ запрещён. Недостаточно прав.
    </div>;
  }
  
  return children;
}

function App() {
  return (
    <>  {/* Убрали BrowserRouter отсюда */}
      <Header />
      <main style={{ minHeight: 'calc(100vh - 60px)' }}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Защищённые маршруты - статьи */}
          <Route path="/articles" element={
            <ProtectedRoute allowedRoles={['admin', 'author']}>
              <Articles />
            </ProtectedRoute>
          } />
          
          <Route path="/articles/create" element={
            <ProtectedRoute allowedRoles={['admin', 'author']}>
              <ArticleCreate />
            </ProtectedRoute>
          } />
          
          <Route path="/articles/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin', 'author']}>
              <ArticleEdit />
            </ProtectedRoute>
          } />
          
          <Route path="/articles/:id" element={<ArticleDetail />} />
          
          {/* Админ-панель */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div>Админ-панель (в разработке)</div>
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>404 - Страница не найдена</h2>
              <a href="/" style={{ color: '#3498db' }}>Вернуться на главную</a>
            </div>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;