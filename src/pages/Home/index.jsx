import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Categories from '../../components/Categories';

import RestaurantCard from '../../components/RestaurantCard';

import s from './home.module.scss';

const Home = ({ restaurantsData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants] = useState(restaurantsData);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Здесь будет логика поиска
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={s.container}>
      <div className={s.searchTitle}>
        <h1>Все рестораны</h1>
        <div className={s.searchContainer}>
          <div className={s.searchInputWrapper}>
            <Search className={s.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Найти ресторан..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={s.searchInput}
            />
          </div>
          <button onClick={handleSearch} className={s.searchButton}>
            <span>Найти</span>
            <ArrowRight size={18} className={s.arrowIcon} />
          </button>
        </div>
      </div>
      <Categories />
      <div className={s.restaurantsGrid}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            id={restaurant.id}
            name={restaurant.name}
            rating={restaurant.rating}
            deliveryTime={restaurant.deliveryTime}
            cuisine={restaurant.cuisine}
            distance={restaurant.distance}
            imageUrl={restaurant.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
