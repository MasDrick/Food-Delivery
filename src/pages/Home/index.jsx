import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRestaurants, searchRestaurants } from '../../store/slices/restaurantSlice';
import Categories from '../../components/Categories';
import RestaurantCard from '../../components/RestaurantCard';
import s from './home.module.scss';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { restaurants, isLoading, error } = useSelector((state) => state.restaurants);

  // Загрузка ресторанов при монтировании компонента
  useEffect(() => {
    dispatch(fetchAllRestaurants());
  }, [dispatch]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      dispatch(fetchAllRestaurants());
      return;
    }
    dispatch(searchRestaurants(searchQuery));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(fetchAllRestaurants());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isLoading) {
    return <div className={s.container}>Загрузка...</div>;
  }

  if (error) {
    return <div className={s.container}>Ошибка: {error}</div>;
  }

  return (
    <div className={s.container}>
      <div className={s.searchTitle}>
        <h1>Все рестораны</h1>
        <div className={s.searchContainer}>
          <div className={s.searchInputWrapper}>
            <input
              type="text"
              placeholder="Найти ресторан..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={s.searchInput}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className={s.clearButton}
                aria-label="Очистить поиск">
                <X size={18} />
              </button>
            )}
          </div>
          <button onClick={handleSearch} className={s.searchButton}>
            <Search size={20} className={s.arrowIcon} />
          </button>
        </div>
      </div>

      <Categories />

      <div className={s.restaurantsGrid}>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              rating={restaurant.rating}
              deliveryTime={restaurant.delivery_time || restaurant.deliveryTime}
              cuisine={restaurant.cuisine}
              distance={restaurant.distance}
              imageUrl={restaurant.image_url || restaurant.imageUrl}
            />
          ))
        ) : (
          <p>Рестораны не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
