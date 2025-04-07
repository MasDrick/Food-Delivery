import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Clock, MapPin } from 'lucide-react';
import { fetchRestaurantById } from '../../store/slices/restaurantSlice';
import s from './RestaurantPage.module.scss';

const Restaurants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRestaurant, isLoading, error } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <div className={s.container}>Загрузка...</div>;
  }

  if (error) {
    return <div className={s.container}>Ошибка: {error}</div>;
  }

  if (!currentRestaurant) {
    return (
      <div className={s.container}>
        <p>Ресторан не найден</p>
        <button onClick={() => window.history.back()}>Вернуться назад</button>
      </div>
    );
  }

  // Handle different property names that might come from API vs local data
  const restaurant = {
    ...currentRestaurant,
    image_url: currentRestaurant.image_url || currentRestaurant.imageUrl,
    delivery_time: currentRestaurant.delivery_time || currentRestaurant.deliveryTime
  };

  return (
    <div className={s.restaurantPage}>
      <div className={s.heroSection}>
        <div className={s.heroImage} style={{ backgroundImage: `url(${restaurant.image_url})` }} />
        <div className={s.heroContent}>
          <h1 className={s.restaurantTitle}>{restaurant.name}</h1>
        </div>
        <div className={s.restaurantInfo}>
          <div className={s.infoItem}>
            <Star size={18} />
            <span>{restaurant.rating}</span>
          </div>
          <div className={s.infoItem}>
            <Clock size={18} />
            <span>{restaurant.delivery_time} мин</span>
          </div>
          <div className={s.infoItem}>
            <MapPin size={18} />
            <span>{restaurant.distance} км</span>
          </div>
        </div>
      </div>

      <div className={s.menuSection}>
        <h2 className={s.menuTitle}>Меню</h2>
        {restaurant.menu && restaurant.menu.length > 0 ? (
          <table className={s.menuTable}>
            <thead>
              <tr>
                <th>Блюдо</th>
                <th>Вес</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {restaurant.menu.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.weight}</td>
                  <td>{item.price} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Меню временно недоступно.</p>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
