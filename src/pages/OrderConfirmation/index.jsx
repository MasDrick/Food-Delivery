import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { fetchOrderDetails } from '../../store/slices/orderSlice';
import s from './OrderConfirmation.module.scss';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector(state => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  if (isLoading) {
    return <div className={s.loading}>Загрузка информации о заказе...</div>;
  }

  if (error) {
    return <div className={s.error}>{error}</div>;
  }

  if (!currentOrder) {
    return <div className={s.loading}>Информация о заказе не найдена</div>;
  }

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
              <span>Сумма заказа:</span>
              <span>{currentOrder.total_amount} ₽</span>
            </div>
            <div className={s.infoRow}>
              <span>Доставка:</span>
              <span>{currentOrder.delivery_fee} ₽</span>
            </div>
            <div className={s.infoRow}>
              <span>Итого:</span>
              <span className={s.totalAmount}>{Number(currentOrder.total_amount) + Number(currentOrder.delivery_fee)} ₽</span>
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