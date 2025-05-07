import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, ArrowLeft, MessageSquare, Percent } from 'lucide-react';
import { fetchOrderDetails } from '../../store/slices/orderSlice';
import { fetchUserProfile } from '../../store/slices/profileSlice';
import s from './OrderConfirmation.module.scss';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector(state => state.orders);
  const { userProfile} = useSelector((state) => state.profile || {});

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
    // Fetch user profile to get discount information
    dispatch(fetchUserProfile());
  }, [dispatch, orderId]);

  // Calculate the discount amount if applicable
  const calculateDiscount = () => {
    if (!currentOrder || !userProfile?.discount_percent) return 0;
    
    // The total_amount already includes delivery fee, so we use it directly
    const orderTotal = Number(currentOrder.total_amount);
    return (orderTotal * (userProfile.discount_percent / 100)).toFixed(2);
  };

  // Calculate the final total after discount
  const calculateFinalTotal = () => {
    if (!currentOrder) return 0;
    
    const orderTotal = Number(currentOrder.total_amount);
    const discountAmount = calculateDiscount();
    
    // Simply subtract discount from the total that already includes delivery
    return (orderTotal - discountAmount).toFixed(2);
  };

  if (isLoading) {
    return <div className={s.loading}>Загрузка информации о заказе...</div>;
  }

  if (error) {
    return <div className={s.error}>{error}</div>;
  }

  if (!currentOrder) {
    return <div className={s.loading}>Информация о заказе не найдена</div>;
  }

  const discountAmount = calculateDiscount();
  const finalTotal = calculateFinalTotal();
  const hasDiscount = discountAmount > 0;

  return (
    <div className={s.confirmationPage}>
      <div className={s.confirmationCard}>
        <div className={s.successIcon}>
          <CheckCircle size={64} color="#4CAF50" />
        </div>
        
        <h1>Заказ успешно оформлен!</h1>
        <p className={s.orderNumber}>Номер заказа: {currentOrder.id}</p>
        
        <div className={s.orderDetails}>
          <h2>Детали заказа</h2>
          
          <div className={s.orderInfo}>
            <div className={s.infoRow}>
              <span>Статус:</span>
              <span
                className={`${s.statusBadge} ${s['status-' + currentOrder.status]}`}
              >
                {{
                  pending: 'Ожидает обработки',
                  processing: 'В обработке',
                  delivering: 'Доставляется',
                  completed: 'Завершён',
                  cancelled: 'Отменён'
                }[currentOrder.status] || currentOrder.status}
              </span>
            </div>
            <div className={s.infoRow}>
              <span>Дата заказа:</span>
              <span>{new Date(currentOrder.created_at).toLocaleString()}</span>
            </div>
            <div className={s.infoRow}>
              <span>Адрес доставки:</span>
              <span>{currentOrder.address}</span>
            </div>
            <div className={s.infoRow}>
              <span>Телефон:</span>
              <span>{currentOrder.phone}</span>
            </div>
            <div className={s.infoRow}>
              <span>Сумма заказа (с доставкой):</span>
              <span>{currentOrder.total_amount} ₽</span>
            </div>
            {hasDiscount && (
              <div className={`${s.infoRow} ${s.discountRow}`}>
                <span>
                  <Percent size={16} /> Скидка ({userProfile.discount_percent}%):
                </span>
                <span className={s.discountAmount}>-{discountAmount} ₽</span>
              </div>
            )}
            <div className={s.infoRow}>
              <span>Итого:</span>
              <span className={s.totalAmount}>{finalTotal} ₽</span>
            </div>
          </div>
          
          <h2>Состав заказа</h2>
          {currentOrder.items && currentOrder.items.map((item, index) => (
            <div key={index} className={s.orderItem}>
              <div className={s.itemInfo}>
                <span className={s.itemName}>{item.item_name}</span>
                <span className={s.restaurantName}>Ресторан: {item.restaurant_name}</span>
              </div>
              <div className={s.itemDetails}>
                <span>{item.quantity} × {item.price} ₽</span>
                <span className={s.itemTotal}>{item.quantity * item.price} ₽</span>
              </div>
            </div>
          ))}
        </div>
        
        {currentOrder.comment && (
          <div className={s.commentRow}>
            <div className={s.commentHeader}>
              <MessageSquare size={16} />
              <span>Комментарий к заказу:</span>
            </div>
            <div className={s.commentText}>{currentOrder.comment}</div>
          </div>
        )}
        
        <div className={s.actions}>
          <Link to="/" className={s.homeButton}>
            <ArrowLeft size={16} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;