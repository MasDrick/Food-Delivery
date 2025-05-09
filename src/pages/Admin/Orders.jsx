import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  User,
  Package,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  fetchAdminOrders,
  updateOrderStatus,
  filterOrders,
  searchOrders,
  sortOrders,
} from "../../store/slices/adminOrdersSlice";
import s from "./Admin.module.scss";

const Orders = () => {
  const dispatch = useDispatch();
  const { filteredOrders, loading, error, activeFilter, statusOptions } =
    useSelector((state) => state.adminOrders);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchOrders(value));
  };

  const handleOrderClick = (e, orderId) => {
    e.stopPropagation();
    navigate(`/orders/${orderId}`);
  };

  const handleFilterChange = (filter) => {
    dispatch(filterOrders(filter));
  };

  const handleSort = (field) => {
    const direction =
      sortConfig.field === field && sortConfig.direction === "desc"
        ? "asc"
        : "desc";
    setSortConfig({ field, direction });
    dispatch(sortOrders({ field, direction }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      // Optional: Show success notification
    } catch (error) {
      console.error("Failed to update status:", error);
      // Optional: Show error notification
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Translate status to Russian
  const getStatusText = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.label : status;
  };

  // Format number with spaces
  const formatNumber = (value) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return numValue.toLocaleString("ru-RU");
  };

  if (loading && filteredOrders.length === 0) {
    return <div className={s.loading}>Загрузка заказов...</div>;
  }

  if (error) {
    return <div className={s.errorContainer}>Ошибка: {error}</div>;
  }

  return (
    <div className={s.ordersManagementContent}>
      <h2>Управление заказами</h2>

      <div className={s.ordersControls}>
        <div className={s.searchContainer}>
          <Search size={18} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Поиск заказов..."
            value={searchTerm}
            onChange={handleSearch}
            className={s.searchInput}
          />
        </div>

        <div className={s.filterContainer}>
          <Filter size={18} className={s.filterIcon} />
          <div className={s.filterButtons}>
            <button
              className={`${s.filterButton} ${
                activeFilter === "all" ? s.active : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              Все
            </button>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`${s.filterButton} ${s[option.value]} ${
                  activeFilter === option.value ? s.active : ""
                }`}
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.ordersSortHeader}>
        <div className={s.sortColumn} onClick={() => handleSort("id")}>
          <span>#ID</span>
          <ArrowUpDown size={14} className={s.sortIcon} />
        </div>
        <div className={s.sortColumn} onClick={() => handleSort("date")}>
          <span>Дата</span>
          <ArrowUpDown size={14} className={s.sortIcon} />
        </div>
        <div className={s.sortColumn}>
          <span>Клиент</span>
        </div>
        <div className={s.sortColumn} onClick={() => handleSort("amount")}>
          <span>Сумма</span>
          <ArrowUpDown size={14} className={s.sortIcon} />
        </div>
        <div className={s.sortColumn}>
          <span>Статус</span>
        </div>
        <div className={s.sortColumn}>
          <span>Действия</span>
        </div>
      </div>

      <div className={s.ordersList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className={s.orderItem}>
              <div className={s.orderWrap}>
                <div className={s.orderSummary}>
                  <div
                    className={s.orderNumber}
                    onClick={(e) => handleOrderClick(e, order.id)}
                  >
                    <span className={s.orderNumber}>#{order.id}</span>
                  </div>
                  <div className={s.orderDate}>
                    <Calendar size={14} />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className={s.orderUser}>
                    <User size={14} />
                    <span>{order.user_name}</span>
                  </div>
                  <div className={s.orderAmount}>
                    ₽{formatNumber(order.total_amount)}
                  </div>
                  <div className={`${s.orderStatus} ${s[order.status]}`}>
                    {getStatusText(order.status)}
                  </div>
                  <div className={s.orderActions}>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, e.target.value);
                      }}
                      className={s.statusSelect}
                      disabled={
                        order.status === "completed" ||
                        order.status === "cancelled"
                      }
                    >
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={
                            (order.status === "completed" ||
                              order.status === "cancelled") &&
                            order.status !== option.value
                          }
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className={s.expandButton}
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  {expandedOrders[order.id] ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  <span>Показать детали</span>
                </button>
              </div>

              {expandedOrders[order.id] && (
                <div className={s.orderDetails}>
                  <div className={s.orderInfo}>
                    <div className={s.infoRow}>
                      <MapPin size={16} />
                      <span className={s.infoLabel}>Адрес:</span>
                      <span className={s.infoValue}>{order.address}</span>
                    </div>
                    <div className={s.infoRow}>
                      <Clock size={16} />
                      <span className={s.infoLabel}>Обновлен:</span>
                      <span className={s.infoValue}>
                        {formatDate(order.updated_at)}
                      </span>
                    </div>
                    <div className={s.infoRow}>
                      <Package size={16} />
                      <span className={s.infoLabel}>Рестораны:</span>
                      <span className={s.infoValue}>
                        {order.restaurant_count}
                      </span>
                    </div>
                    {order.comment && (
                      <div className={s.orderComment}>
                        <span className={s.commentLabel}>Комментарий:</span>
                        <span className={s.commentText}>{order.comment}</span>
                      </div>
                    )}
                  </div>

                  <div className={s.orderItems}>
                    <h4>Состав заказа</h4>
                    <table className={s.itemsTable}>
                      <thead>
                        <tr>
                          <th>Товар</th>
                          <th>Ресторан</th>
                          <th>Кол-во</th>
                          <th>Цена</th>
                          <th>Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.restaurant_name}</td>
                            <td>{item.quantity}</td>
                            <td>₽{formatNumber(item.price)}</td>
                            <td>
                              ₽
                              {formatNumber(
                                parseFloat(item.price) * item.quantity
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className={s.totalLabel}>
                            Доставка:
                          </td>
                          <td>₽{formatNumber(order.delivery_fee)}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" className={s.totalLabel}>
                            Итого:
                          </td>
                          <td className={s.totalAmount}>
                            ₽{formatNumber(order.total_amount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={s.noOrders}>
            {searchTerm ? "Заказы не найдены" : "Нет заказов"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
