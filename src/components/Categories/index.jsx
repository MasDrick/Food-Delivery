import React, { useState } from 'react';
import s from './categories.module.scss';

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(1);

  const categories = [
    { id: 1, name: 'Все' },
    { id: 2, name: 'Бургеры' },
    { id: 3, name: 'Пицца' },
    { id: 4, name: 'Салаты' },
    { id: 5, name: 'Десерты' },
  ];

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    // Дополнительная логика при клике
  };

  return (
    <ul className={s.categoriesList}>
      {categories.map((category) => (
        <li
          key={category.id}
          className={`${s.categoryItem} ${activeCategory === category.id ? s.active : ''}`}
          onClick={() => handleCategoryClick(category.id)}>
          {category.name}
        </li>
      ))}
    </ul>
  );
};

export default Categories;
