import React from 'react';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router'; // Убедитесь, что используется react-router-dom

import s from './RestaurantCard.module.scss';

const RestaurantCard = ({ id, name, rating, deliveryTime, cuisine, distance, imageUrl }) => {
  return (
    <div className={s.restaurantCard}>
      <div className={s.cardImage}>
        <img src={imageUrl} alt={name} />
        <div className={s.ratingBadge}>
          <Star size={16} fill="#fff" />
          <span>{rating}</span>
        </div>
      </div>

      <div className={s.cardContent}>
        <h3>{name}</h3>

        <div className={s.metaInfo}>
          <span className={s.cuisine}>{cuisine}</span>

          <div className={s.details}>
            <span>
              <Clock size={14} />
              {deliveryTime}
            </span>
            <span>
              <MapPin size={14} />
              {distance}
            </span>
          </div>
        </div>

        <Link to={`/restaurant/${id}`} className={s.moreButton}>
          Подробнее <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
