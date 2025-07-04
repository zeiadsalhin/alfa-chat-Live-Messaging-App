// src/middleware/Middleware.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Middleware component checks if the user is authenticated
// If not authenticated, redirects to the registration page
const Middleware = ({ children }: { children: React.ReactNode }) => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = Boolean(userId);
    const isRegisterRoute = location.pathname === '/register';

    if (!isAuth && !isRegisterRoute) {
      navigate('/register', { replace: true });
    }

    if (isAuth && isRegisterRoute) {
      navigate('/', { replace: true });
    }
  }, [userId, location.pathname]);

  return <>{children}</>;
};

export default Middleware;
