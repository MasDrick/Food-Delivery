import React from "react";
import { Star, Clock, MapPin, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

import s from "./RestaurantCard.module.scss";

const RestaurantCard = ({
  id,
  name,
  rating,
  deliveryTime,
  cuisine,
  distance,
  imageUrl,
}) => {
  const cart = useSelector((state) => state.cart);
  const restaurantCart = cart.restaurants[id] || null;

  // Подсчет общего количества товаров и суммы
  let totalItems = 0;
  let totalPrice = 0;

  if (restaurantCart) {
    totalItems = Object.values(restaurantCart.items).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    totalPrice = Object.values(restaurantCart.items).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

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
          <div>
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
          {restaurantCart && (
            <div className={s.cartInfo}>
              <div className={s.cartItemsCount}>
                <ShoppingCart size={16} />
                <span>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "товар"
                    : totalItems < 5
                    ? "товара"
                    : "товаров"}
                </span>
              </div>
              <div className={s.cartTotalPrice}>{totalPrice} ₽</div>
            </div>
          )}
        </div>

        {/* Блок с информацией о корзине */}

        <Link to={`/restaurant/${id}`} className={s.moreButton}>
          Подробнее <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
