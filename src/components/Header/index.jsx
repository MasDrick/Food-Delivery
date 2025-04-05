import React, { useState } from 'react';
import Button from '../../ui/Button';
import { UserRound, ShoppingCart, ChefHat } from 'lucide-react';
import s from './header.module.scss';

import { Link } from 'react-router';

const Header = () => {
  const [activeLink, setActiveLink] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

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
              <span>{isAdmin ? 'Админка' : 'Профиль'}</span>
            </Link>
          </li>
        </ul>
        <Button name={'Выйти'} />
      </div>
    </div>
  );
};

export default Header;
