import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router';
import { UserRound, ShoppingCart, ChefHat, Menu, X } from 'lucide-react';
import Button from '../../ui/Button';
import { logoutUser } from '../../store/slices/authSlice';
import s from './header.module.scss'; 

const Header = () => {
  const [activeLink, setActiveLink] = useState(0); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin'; 

  // Get the username to display in the header
  const displayName = user?.username || 'Пользователь';

  // Update active link based on current path when component mounts or path changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveLink(0);
    } else if (path === '/cart') {
      setActiveLink(1);
    } else if (path === '/profile') {
      setActiveLink(2);
    }
  }, [location.pathname]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle link click - add this function
  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Add these navigation functions
  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className={s.header}>
      <Link to="/">
        <div className={s.logo}>
          <img src="/logo.svg" alt="logoimg" />
          <div className={s.logoInfo}>
            <h1>Порция Счастья</h1>
            <p>С любовью к вашему столу!</p>
          </div>
        </div>
      </Link>

      <div className={s.mobileMenuToggle} onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      <div className={`${s.menuContainer} ${mobileMenuOpen ? s.open : ''}`}>
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
            
            {/* Add theme toggle button */}
           
          </div>
        ) : (
          <div className={s.authButtons}>
            <Button name={'Регистрация'} onClick={handleRegister} />
            <Button name={'Войти'} onClick={handleLogin} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
