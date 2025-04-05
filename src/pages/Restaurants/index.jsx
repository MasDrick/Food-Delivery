import React from 'react';
import { useParams } from 'react-router';
import { Star, Clock, MapPin } from 'lucide-react';
import s from './RestaurantPage.module.scss';

const Restaurants = ({ restaurants }) => {
  const { id } = useParams(); // Получаем id из URL
  const restaurant = restaurants.find((r) => r.id === Number(id)); // Находим ресторан по id
  console.log(restaurant);

  if (!restaurant) {
    return (
      <div>
        <p>Ресторан не найден</p>
        <button onClick={() => window.history.back()}>Вернуться назад</button>
      </div>
    );
  }

  return (
    <div className={s.restaurantPage}>
      <div className={s.heroSection}>
        <div className={s.heroImage} style={{ backgroundImage: `url(${restaurant.imageUrl})` }} />
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
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className={s.infoItem}>
            <MapPin size={18} />
            <span>{restaurant.distance}</span>
          </div>
        </div>
      </div>

      {/* Таблица с меню */}
      <div className={s.menuSection}>
        <h2 className={s.menuTitle}>Меню</h2>
        {restaurant.menu.length > 0 ? (
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
