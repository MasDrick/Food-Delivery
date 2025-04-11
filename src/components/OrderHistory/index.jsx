import React from 'react';
import { Calendar } from 'lucide-react';
import s from './OrderHistory.module.scss';

const OrderHistory = ({ isLoading, orders, ordersCount }) => {
  return (
    <div className={s.ordersSection}>
      <h2>История заказов</h2>
      {isLoading ? (
        <div className={s.loading}>Загрузка заказов...</div>
      ) : ordersCount > 0 ? (
        <div className={s.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={s.orderCard}>
              <div className={s.orderHeader}>
                <div className={s.orderInfo}>
                  <h3>Заказ #{order.id}</h3>
                  <div className={s.orderMeta}>
                    <div className={s.orderDate}>
                      <Calendar size={14} />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={s.orderStatus}>{order.status}</div>
                  </div>
                </div>
                <div className={s.orderTotal}>{order.total_price} ₽</div>
              </div>
              <div className={s.orderRestaurant}>Ресторан: {order.restaurant_name}</div>
              <div className={s.orderItems}>
                {order.items && order.items.map((item) => (
                  <div key={item.id} className={s.orderItem}>
                    <span className={s.itemName}>{item.name}</span>
                    <span className={s.itemPrice}>{item.price} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.emptyOrders}>
          У вас пока нет заказов
        </div>
      )}
    </div>
  );
};

export default OrderHistory;