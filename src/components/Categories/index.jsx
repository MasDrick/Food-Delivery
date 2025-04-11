import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchRestaurantsByCategory, clearCategoryFilter } from '../../store/slices/categoriesSlice';
import s from './categories.module.scss';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, selectedCategory, isLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (id) => {
    if (selectedCategory === id) {
      // If clicking the already selected category, clear the filter
      dispatch(clearCategoryFilter());
    } else {
      // Otherwise, filter by the selected category
      dispatch(fetchRestaurantsByCategory(id));
    }
  };
  
  // Only show these specific categories
  const displayCategories = [
    { id: 0, name: 'Все' },
    { id: 1, name: 'Итальянская' },
    { id: 2, name: 'Японская' },
    { id: 3, name: 'Американская' },
    { id: 4, name: 'Грузинская' },
    { id: 5, name: 'Веганская' }
  ];
  
  if (isLoading && categories.length === 0) {
    return <div>Загрузка категорий...</div>;
  }

  return (
    <ul className={s.categoriesList}>
      {displayCategories.map((category) => (
        <li
          key={category.id}
          className={`${s.categoryItem} ${selectedCategory === category.id ? s.active : ''}`}
          onClick={() => handleCategoryClick(category.id)}>
          {category.name}
        </li>
      ))}
    </ul>
  );
};

export default Categories;
