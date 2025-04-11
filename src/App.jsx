import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import Header from './components/Header/';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Register from './pages/Register/Registration';
import Login from './pages/Login/LoginForm';
import { checkAuthStatus } from './store/slices/authSlice';
import s from './app.module.scss';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if current route is login or register
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // Проверка авторизации при загрузке
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isLoading) {
    return <div className={s.loading}>Проверка авторизации...</div>;
  }

  // Render auth pages outside the wrapper
  if (isAuthPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    );
  }

  // Render regular pages inside the wrapper
  return (
    <div className={s.wrapper}>
      <Header />
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<Restaurants />} />

        {/* Защищенные маршруты */}
        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
<ThemeToggle />
    </div>
  );
}

export default App;
