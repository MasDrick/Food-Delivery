import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Clock, MapPin } from 'lucide-react';
import { fetchRestaurantById } from '../../store/slices/restaurantSlice';
import { addToCart } from '../../store/slices/cartSlice';
import MenuItemCard from '../../components/MenuItemCard';
import s from './RestaurantPage.module.scss';

const Restaurants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRestaurant, isLoading, error } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    if (currentRestaurant) {
      dispatch(addToCart({
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name,
        item: {
          id: item.id,
          name: item.name,
          price: item.price,
          weight: item.weight,
          quantity: item.quantity
        }
      }));
    }
  };

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
            <span>{restaurant.delivery_time}</span>
          </div>
          <div className={s.infoItem}>
            <MapPin size={18} />
            <span>{restaurant.distance}</span>
          </div>
        </div>
      </div>

      <div className={s.menuSection}>
        <h2 className={s.menuTitle}>Меню</h2>
        
        {restaurant.menu && restaurant.menu.length > 0 ? (
          <div className={s.menuGrid}>
            {restaurant.menu.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                weight={item.weight}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <p>Меню временно недоступно.</p>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
