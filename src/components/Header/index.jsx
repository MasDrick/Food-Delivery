import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router'; // Changed from 'react-router' to 'react-router-dom'
import { UserRound, ShoppingCart, ChefHat } from 'lucide-react';
import Button from '../../ui/Button';
import { logoutUser } from '../../store/slices/authSlice';
import s from './header.module.scss'; 

const Header = () => {
  const [activeLink, setActiveLink] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  // Get the username to display in the header
  const displayName = user?.username || 'Пользователь';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Use unwrap to properly handle the Promise
      // Manually remove token as a fallback
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove token and redirect even if API call fails
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  return (
    <div className={s.header}>
      <Link to="/">
        <div className={s.logo}>
          <img src="./logo.svg" alt="logoimg" />
          <div>
            <h1>Порция Счастья</h1>
            <p>С любовью к вашему столу!</p>
          </div>
        </div>
      </Link>

      {isAuthenticated ? (
        <div className={s.menu}>
          <ul className={s.nav}>
            <li>
              <Link
                to="/"
                className={activeLink === 0 ? s.active : ''}
                onClick={() => handleLinkClick(0)}>
                <ChefHat size={18} />
                <span>Рестораны</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className={activeLink === 1 ? s.active : ''}
                onClick={() => handleLinkClick(1)}>
                <ShoppingCart size={18} />
                <span>Корзина</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`${activeLink === 2 ? s.active : ''} ${isAdmin ? s.admin : ''}`}
                onClick={() => handleLinkClick(2)}>
                <UserRound size={18} />
                <span>{isAdmin ? 'Админка' : displayName}</span>
              </Link>
            </li>
          </ul>
          <Button name={'Выйти'} onClick={handleLogout} />
        </div>
      ) : (
        <div className={s.authButtons}>
          <Button name={'Войти'} onClick={handleLogin} />
        </div>
      )}
    </div>
  );
};

export default Header;
