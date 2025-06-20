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
import NotFound from './pages/NotFound';
import OrderConfirmation from './pages/OrderConfirmation';
import { checkAuthStatus } from './store/slices/authSlice';
import s from './app.module.scss';
import Admin from './pages/Admin'; // Add this import
import Notification from './components/Notification';
import CourierOrders from './pages/Courier/CourierOrders';

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
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Render regular pages inside the wrapper
  return (
    <div className={s.wrapper}>
      <Header />
      <Notification /> {/* Make sure this is here */}
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<Restaurants />} />

        {/* Защищенные маршруты */}
        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route
          path="/orders/:orderId"
          element={isAuthenticated ? <OrderConfirmation /> : <Navigate to="/login" />}
        />

        {/* Admin route - add this */}
        <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />

        {/* 404 страница */}
        <Route path="/courier/orders" element={<CourierOrders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ThemeToggle />
    </div>
  );
}

export default App;
