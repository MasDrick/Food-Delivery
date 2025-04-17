import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Minus } from 'lucide-react';
import s from './MenuItemCard.module.scss';

const MenuItemCard = ({ id, name, price, weight, onAddToCart }) => {
  const restaurants = useSelector(state => state.cart.restaurants || {});
  const [quantity, setQuantity] = useState(0);

  // Initialize quantity from cart if item exists in any restaurant
  useEffect(() => {
    // Safely check if restaurants exists and has entries
    if (restaurants) {
      // Look through all restaurants to find this item
      for (const restaurantId in restaurants) {
        const restaurant = restaurants[restaurantId];
        if (restaurant && restaurant.items && restaurant.items[id]) {
          setQuantity(restaurant.items[id].quantity);
          return;
        }
      }
    }
    // If not found, ensure quantity is 0
    setQuantity(0);
  }, [restaurants, id]);

  const handleAddItem = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToCart({ id, name, price, weight, quantity: newQuantity });
  };

  const handleRemoveItem = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAddToCart({ id, name, price, weight, quantity: newQuantity });
    }
  };

  return (
    <div className={s.menuItemCard}>
      <div className={s.itemInfo}>
        <h3 className={s.itemName}>{name}</h3>
        <div className={s.itemDetails}>
          <span className={s.itemWeight}>{weight}</span>
          <span className={s.itemPrice}>{price} ₽</span>
        </div>
      </div>
      
      {quantity === 0 ? (
        <button 
          className={s.addButton}
          onClick={handleAddItem}
          aria-label="Добавить в корзину"
        >
          <Plus size={20} />
        </button>
      ) : (
        <div className={s.quantityControl}>
          <button 
            className={s.quantityButton}
            onClick={handleRemoveItem}
            aria-label="Уменьшить количество"
          >
            <Minus size={16} />
          </button>
          <span className={s.quantityDisplay}>{quantity}</span>
          <button 
            className={s.quantityButton}
            onClick={handleAddItem}
            aria-label="Увеличить количество"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;