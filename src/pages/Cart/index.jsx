import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { addToCart, clearCart, clearRestaurantItems } from '../../store/slices/cartSlice';
import s from './Cart.module.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const { restaurants } = useSelector(state => state.cart);
  
  // Calculate totals
  const restaurantCount = Object.keys(restaurants).length;
  const itemsCount = Object.values(restaurants).reduce(
    (sum, restaurant) => sum + Object.values(restaurant.items).reduce(
      (itemSum, item) => itemSum + item.quantity, 0
    ), 0
  );
  
  const subtotal = Object.values(restaurants).reduce(
    (sum, restaurant) => sum + Object.values(restaurant.items).reduce(
      (itemSum, item) => itemSum + (item.price * item.quantity), 0
    ), 0
  );
  
  const deliveryFee = 150 * restaurantCount; // Delivery fee per restaurant
  const total = subtotal + deliveryFee;

  // Handle quantity changes
  const handleUpdateQuantity = (restaurantId, restaurantName, item, newQuantity) => {
    dispatch(addToCart({
      restaurantId,
      restaurantName,
      item: {
        ...item,
        quantity: newQuantity
      }
    }));
  };

  // Handle clearing the cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  // Handle clearing items from a specific restaurant
  const handleClearRestaurant = (restaurantId) => {
    dispatch(clearRestaurantItems({ restaurantId }));
  };

  // If cart is empty
  if (restaurantCount === 0) {
    return (
      <div className={s.emptyCart}>
        <ShoppingBag size={64} />
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте блюда из ресторанов, чтобы сделать заказ</p>
        <Link to="/" className={s.continueShoppingBtn}>
          <ArrowLeft size={16} />
          Перейти к ресторанам
        </Link>
      </div>
    );
  }

  return (
    <div className={s.cartPage}>
      <div className={s.cartHeader}>
        <h1>Корзина</h1>
        <button className={s.clearCartBtn} onClick={handleClearCart}>
          <Trash2 size={16} />
          Очистить корзину
        </button>
      </div>

      <div className={s.cartContent}>
        <div className={s.restaurantsContainer}>
          {Object.values(restaurants).map(restaurant => (
            <div key={restaurant.id} className={s.restaurantSection}>
              <div className={s.restaurantHeader}>
                <h2>{restaurant.name}</h2>
                <div className={s.restaurantActions}>
                  <Link to={`/restaurant/${restaurant.id}`} className={s.viewRestaurantLink}>
                    Перейти к ресторану
                  </Link>
                  <button 
                    className={s.clearRestaurantBtn} 
                    onClick={() => handleClearRestaurant(restaurant.id)}
                  >
                    <Trash2 size={14} />
                    Удалить
                  </button>
                </div>
              </div>

              <div className={s.itemsList}>
                {Object.values(restaurant.items).map(item => (
                  <div key={item.id} className={s.cartItem}>
                    <div className={s.itemInfo}>
                      <h3 className={s.itemName}>{item.name}</h3>
                      <span className={s.itemWeight}>{item.weight}</span>
                    </div>
                    
                    <div className={s.itemActions}>
                      <div className={s.quantityControl}>
                        <button 
                          className={s.quantityButton}
                          onClick={() => handleUpdateQuantity(
                            restaurant.id, 
                            restaurant.name, 
                            item, 
                            Math.max(0, item.quantity - 1)
                          )}
                          aria-label="Уменьшить количество"
                        >
                          <Minus size={16} />
                        </button>
                        <span className={s.quantity}>{item.quantity}</span>
                        <button 
                          className={s.quantityButton}
                          onClick={() => handleUpdateQuantity(
                            restaurant.id, 
                            restaurant.name, 
                            item, 
                            item.quantity + 1
                          )}
                          aria-label="Увеличить количество"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className={s.itemPrice}>
                        {item.price * item.quantity} ₽
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={s.orderSummary}>
          <h2>Сумма заказа</h2>
          
          <div className={s.summaryDetails}>
            <div className={s.summaryRow}>
              <span>Товары ({itemsCount})</span>
              <span>{subtotal} ₽</span>
            </div>
            <div className={s.summaryRow}>
              <span>Доставка ({restaurantCount} {restaurantCount === 1 ? 'ресторан' : 
                (restaurantCount > 1 && restaurantCount < 5) ? 'ресторана' : 'ресторанов'})</span>
              <span>{deliveryFee} ₽</span>
            </div>
            <div className={`${s.summaryRow} ${s.totalRow}`}>
              <span>Итого</span>
              <span>{total} ₽</span>
            </div>
          </div>
          
          <button className={s.checkoutButton}>
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
