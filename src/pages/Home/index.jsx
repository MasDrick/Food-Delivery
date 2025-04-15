import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRestaurants } from '../../store/slices/restaurantSlice';
import { fetchRestaurantsByCategory } from '../../store/slices/categoriesSlice';
import Categories from '../../components/Categories';
import RestaurantCard from '../../components/RestaurantCard';
import SearchBar from '../../components/SearchBar';
import RestaurantSkeleton from '../../components/SkeletonLoader/RestaurantSkeleton';
import s from './home.module.scss';

const Home = () => {
  const dispatch = useDispatch();
  const { restaurants, isLoading: restaurantsLoading } = useSelector((state) => state.restaurants);
  const { filteredRestaurants, selectedCategory, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  useEffect(() => {
    dispatch(fetchAllRestaurants());
    // Set "Все" (id: 0) as the default selected category
    dispatch(fetchRestaurantsByCategory(0));
  }, [dispatch]);

  // Determine which restaurants to display
  const displayRestaurants = selectedCategory ? filteredRestaurants : restaurants;
  const isLoading = restaurantsLoading || categoriesLoading;// true;

  // Создаем массив скелетонов для отображения во время загрузки
  const skeletons = Array(6).fill().map((_, index) => (
    <RestaurantSkeleton key={`skeleton-${index}`} />
  ));

  return (
    <div className={s.container}>
      <div className={s.topSection}>
        <Categories />
        <SearchBar selectedCategory={selectedCategory} />
      </div>

      {isLoading ? (
        <div className={s.restaurantsGrid}>
          {skeletons}
        </div>
      ) : (
        <div className={s.restaurantsGrid}>
          {displayRestaurants.length > 0 ? (
            displayRestaurants.map((restaurant) => (
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
      )}
    </div>
  );
};

export default Home;
