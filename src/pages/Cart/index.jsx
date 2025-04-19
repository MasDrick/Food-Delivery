import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { addToCart, clearCart, clearRestaurantItems } from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/orderSlice';
import s from './Cart.module.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { isLoading, error: orderError } = useSelector(state => state.orders);
  
  // Add the missing state variable
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add error state
  const [error, setError] = useState(null);
  
  // Состояние для формы доставки
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    comment: ''
  });
  
  // Состояние для отображения формы доставки
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  
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
  
  // Handle input change for delivery form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkout button click
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=cart');
      return;
    }
    
    setShowDeliveryForm(true);
  };
  
  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare order data in the format expected by the backend
      const orderData = {
        address: deliveryInfo.address,
        phone: deliveryInfo.phone,
        comment: deliveryInfo.comment || "",
        total_amount: total,
        delivery_fee: deliveryFee,
        items: Object.values(restaurants).flatMap(restaurant => 
          Object.values(restaurant.items).map(item => ({
            menu_item_id: item.id,
            restaurant_id: restaurant.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          }))
        )
      };
      
      console.log("Sending order data:", orderData);
      
      // Use the createOrder action from Redux slice
      const resultAction = await dispatch(createOrder(orderData));
      
      if (createOrder.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Ошибка при создании заказа');
      }
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Redirect to order confirmation page
      navigate(`/orders/${resultAction.payload.orderId || resultAction.payload.id}`);
      
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.message);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
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

  // Если отображается форма доставки
  if (showDeliveryForm) {
    return (
      <div className={s.cartPage}>
        <div className={s.cartHeader}>
          <h1>Оформление заказа</h1>
          <button 
            className={s.backButton} 
            onClick={() => setShowDeliveryForm(false)}
          >
            <ArrowLeft size={16} />
            Вернуться к корзине
          </button>
        </div>
        
        <div className={s.deliveryFormContainer}>
          <form onSubmit={handleSubmitOrder} className={s.deliveryForm}>
            <div className={s.formGroup}>
              <label htmlFor="address">Адрес доставки *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={deliveryInfo.address}
                onChange={handleInputChange}
                required
                placeholder="Улица, дом, квартира"
                className={s.formInput}
              />
            </div>
            
            <div className={s.formGroup}>
              <label htmlFor="phone">Телефон *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={deliveryInfo.phone}
                onChange={handleInputChange}
                required
                placeholder="+7 (___) ___-__-__"
                className={s.formInput}
              />
            </div>
            
            <div className={s.formGroup}>
              <label htmlFor="comment">Комментарий к заказу</label>
              <textarea
                id="comment"
                name="comment"
                value={deliveryInfo.comment}
                onChange={handleInputChange}
                placeholder="Комментарий к заказу"
                className={s.formTextarea}
              />
            </div>
            
            {error && <div className={s.errorMessage}>{error}</div>}
            
            <div className={s.orderSummaryMini}>
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
            
            <button 
              type="submit" 
              className={s.submitOrderButton}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Оформление...' : 'Подтвердить заказ'}
            </button>
          </form>
        </div>
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
          
          <button 
            className={s.checkoutButton}
            onClick={handleCheckoutClick}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
