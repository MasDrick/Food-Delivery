import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Clock,
  ShoppingBag,
  Percent,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import s from './OrderHistoryCard.module.scss';

const statusMap = {
  pending: { label: 'Ожидает обработки', className: s.statusPending },
  processing: { label: 'В обработке', className: s.statusProcessing },
  delivering: { label: 'Доставляется', className: s.statusDelivering },
  completed: { label: 'Завершён', className: s.statusCompleted },
  cancelled: { label: 'Отменён', className: s.statusCancelled },
  transferring: { label: 'Передача', className: s.statusTransferring }, // Changed to match the CSS class name
};

const OrderHistoryCard = ({ order, discountPercent }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const status = statusMap[order.status] || { label: order.status, className: '' };

  const toggleExpand = () => setExpanded(!expanded);

  const handleOrderClick = (e) => {
    e.stopPropagation();
    navigate(`/orders/${order.id}`);
  };

  const formattedDate = new Date(order.created_at).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate discount amount if applicable
  const hasDiscount = discountPercent && Number(discountPercent) > 0;
  const discountAmount = hasDiscount
    ? (Number(order.total_amount) * (Number(discountPercent) / 100)).toFixed(2)
    : 0;

  // Calculate final total after discount
  const finalTotal = hasDiscount
    ? (Number(order.total_amount) - Number(discountAmount)).toFixed(2)
    : Number(order.total_amount);

  return (
    <div className={`${s.card} ${expanded ? s.expanded : ''}`}>
      <div className={s.cardTop}>
        <div className={s.orderMeta}>
          <div className={s.orderNumberWrapper} onClick={handleOrderClick}>
            <ShoppingBag size={18} />
            <span className={s.orderNumber}>Заказ #{order.id}</span>
          </div>
          <div className={s.statusAndCourier}>
            <span className={`${s.statusBadge} ${status.className}`}>{status.label}</span>
            <span className={s.courierInfo}>
              <User size={16} />
              Курьер:
              <b>
                <i>{order.courier_username ? order.courier_username : '-'}</i>
              </b>
            </span>
          </div>
        </div>

        <div className={s.orderDateWrapper}>
          <Clock size={16} />
          <span className={s.orderDate}>{formattedDate}</span>
        </div>

        <div className={s.summaryInfo}>
          <div className={s.addressInfo}>
            <MapPin size={16} />
            <span>{order.address}</span>
          </div>
          <div className={s.phoneInfo}>
            <Phone size={16} />
            <span>{order.phone}</span>
          </div>
        </div>

        <div className={s.summaryAmount}>
          <span className={s.totalLabel}>Итого:</span>
          <span className={s.totalValue}>
            {hasDiscount ? (
              <>
                <span className={s.originalPrice}>{Number(order.total_amount)} ₽</span>
                {finalTotal} ₽
              </>
            ) : (
              `${Number(order.total_amount)} ₽`
            )}
          </span>
        </div>

        <button className={s.expandButton} onClick={toggleExpand} aria-expanded={expanded}>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span>{expanded ? 'Свернуть детали' : 'Показать детали'}</span>
        </button>
      </div>

      {expanded && (
        <div className={s.expandedContent}>
          {order.comment && (
            <div className={s.commentSection}>
              <h4>Комментарий к заказу:</h4>
              <p>{order.comment}</p>
            </div>
          )}

          <div className={s.itemsBlock}>
            <h3 className={s.itemsTitle}>Состав заказа:</h3>
            <div className={s.itemsList}>
              {order.items.map((item) => (
                <div key={item.id} className={s.itemRow}>
                  <div className={s.itemInfo}>
                    <span className={s.itemName}>{item.item_name}</span>
                    <span className={s.restaurantName}>{item.restaurant_name}</span>
                  </div>
                  <div className={s.itemPricing}>
                    <span className={s.itemQuantity}>{item.quantity} шт</span>
                    <span className={s.itemPrice}>{Number(item.price)} ₽</span>
                    <span className={s.itemTotal}>{Number(item.price) * item.quantity} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={s.totals}>
            <div className={s.totalRow}>
              <span>Стоимость блюд:</span>
              <span>{Number(order.total_amount) - Number(order.delivery_fee)} ₽</span>
            </div>
            <div className={s.totalRow}>
              <span>Доставка:</span>
              <span>{Number(order.delivery_fee)} ₽</span>
            </div>
            {hasDiscount && (
              <div className={`${s.totalRow} ${s.discountRow}`}>
                <span>Скидка ({discountPercent}%):</span>
                <span className={s.discountAmount}>-{discountAmount} ₽</span>
              </div>
            )}
            <div className={`${s.totalRow} ${s.finalTotal}`}>
              <span>Итого:</span>
              <span>{hasDiscount ? finalTotal : Number(order.total_amount)} ₽</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
