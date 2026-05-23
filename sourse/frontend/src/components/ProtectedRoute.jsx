import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>❌ Доступ запрещён</h1>
        <p>У вас недостаточно прав для просмотра этой страницы</p>
      </div>
    );
  }

  return children;
}