import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import emptyImage from '/empty.svg';
import s from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={s.notFoundPage}>
      <div className={s.content}>
        <img src={emptyImage} alt="Page not found" className={s.image} />
        <h1>Страница не найдена</h1>
        <p>Запрашиваемая страница не существует или была удалена</p>
        <Link to="/" className={s.homeButton}>
          <ArrowLeft size={16} />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;