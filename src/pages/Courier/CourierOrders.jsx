import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Phone, Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import {
  fetchAvailableOrders,
  fetchCourierOrders,
  acceptOrder,
  updateOrderStatus,
} from '../../store/slices/courierSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import s from './CourierOrders.module.scss';

const CourierOrders = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [expandedOrders, setExpandedOrders] = useState({});
  const dispatch = useDispatch();
  const { availableOrders, courierOrders, isLoading, error } = useSelector(
    (state) => state.courier,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          dispatch(showNotification({ 
            message: 'Необходима авторизация', 
            type: 'error' 
          }));
          return;
        }
        
        await Promise.all([
          dispatch(fetchAvailableOrders()).unwrap(),
          dispatch(fetchCourierOrders()).unwrap()
        ]);
      } catch (error) {
        dispatch(showNotification({ 
          message: `Ошибка при загрузке заказов: ${error.message || 'Неизвестная ошибка'}`, 
          type: 'error' 
        }));
      }
    };
    fetchData();
  }, [dispatch]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await dispatch(acceptOrder(orderId)).unwrap();
      dispatch(showNotification({ message: 'Заказ успешно принят', type: 'success' }));
      dispatch(fetchAvailableOrders());
      dispatch(fetchCourierOrders());
    } catch (error) {
      dispatch(showNotification({ message: error.message || 'Ошибка при принятии заказа', type: 'error' }));
      console.error('Failed to accept order:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      dispatch(showNotification({ message: 'Статус заказа обновлен', type: 'success' }));
      dispatch(fetchCourierOrders());
    } catch (error) {
      dispatch(showNotification({ message: error.message || 'Ошибка при обновлении статуса', type: 'error' }));
      console.error('Failed to update status:', error);
    }
  };

  const renderOrderCard = (order, isAvailable = false) => (
    <div key={order.id} className={`${s.orderCard} ${s[order.status]}`}>
      <div className={s.orderHeader} onClick={() => toggleOrderDetails(order.id)}>
        <div className={s.orderInfo}>
          <Package size={20} />
          <span className={s.orderNumber}>Заказ #{order.id}</span>
          <span className={s.orderStatus}>{order.status}</span>
        </div>
        <span className={s.orderPrice}>{order.total_amount} ₽</span>
      </div>

      {expandedOrders[order.id] && (
        <div className={s.orderDetails}>
          <div className={s.detailRow}>
            <Clock size={16} />
            <span>{new Date(order.created_at).toLocaleString('ru-RU')}</span>
          </div>
          <div className={s.detailRow}>
            <MapPin size={16} />
            <span>{order.address}</span>
          </div>
          <div className={s.detailRow}>
            <Phone size={16} />
            <span>{order.phone}</span>
          </div>

          <div className={s.actions}>
            {isAvailable && (
              <button className={s.acceptButton} onClick={() => handleAcceptOrder(order.id)}>
                <CheckCircle size={16} />
                Принять заказ
              </button>
            )}
            {!isAvailable && order.status === 'accepted' && (
              <button
                className={s.completeButton}
                onClick={() => handleStatusUpdate(order.id, 'delivering')}>
                Начать доставку
              </button>
            )}
            {!isAvailable && order.status === 'delivering' && (
              <button
                className={s.completeButton}
                onClick={() => handleStatusUpdate(order.id, 'completed')}>
                Завершить доставку
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <div className={s.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={s.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={s.courierContainer}>
      <div className={s.header}>
        <h1>Заказы для доставки</h1>
        <div className={s.stats}>
          <span>
            Активных заказов: {courierOrders.filter((order) => order.status !== 'completed').length}
          </span>
          <span>
            Выполнено сегодня:{' '}
            {courierOrders.filter((order) => order.status === 'completed').length}
          </span>
        </div>
      </div>

      <div className={s.tabs}>
        <button
          className={`${s.tab} ${activeTab === 'available' ? s.active : ''}`}
          onClick={() => setActiveTab('available')}>
          Доступные заказы
        </button>
        <button
          className={`${s.tab} ${activeTab === 'my' ? s.active : ''}`}
          onClick={() => setActiveTab('my')}>
          Мои заказы
        </button>
      </div>

      {activeTab === 'available' && (
        <div>
          {availableOrders.length > 0 ? (
            availableOrders.map((order) => renderOrderCard(order, true))
          ) : (
            <div className={s.emptyState}>Нет доступных заказов</div>
          )}
        </div>
      )}

      {activeTab === 'my' && (
        <div>
          {courierOrders.length > 0 ? (
            courierOrders.map((order) => renderOrderCard(order, false))
          ) : (
            <div className={s.emptyState}>У вас пока нет заказов</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourierOrders;
