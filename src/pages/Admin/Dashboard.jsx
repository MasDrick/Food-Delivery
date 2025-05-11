import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import s from "./Admin.module.scss";

const Dashboard = () => {
  const {
    totalOrders,
    totalUsers,
    totalRestaurants,
    totalRevenue,
    ordersByStatus,
    recentOrders,
    topRestaurants,
    monthlyRevenue,
    topSpender,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  const navigate = useNavigate();

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return <div className={s.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={s.errorContainer}>Ошибка: {error}</div>;
  }

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

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "В обработке";
      case "processing":
        return "Готовится";
      case "delivering":
        return "Доставляется";
      case "completed":
        return "Выполнен";
      case "cancelled":
        return "Отменен";
      default:
        return status;
    }
  };

  const maxRevenue =
    monthlyRevenue && monthlyRevenue.length > 0
      ? Math.max(...monthlyRevenue.map((item) => parseFloat(item.revenue)))
      : 0;

  const formatNumber = (value) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return numValue.toLocaleString("ru-RU");
  };

  const formatRegistrationDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={s.dashboardContent}>
      <h2>Панель управления</h2>
      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <h3>Всего заказов</h3>
          <p className={s.statValue}>{totalOrders}</p>
        </div>
        <div className={s.statCard}>
          <h3>Активных пользователей</h3>
          <p className={s.statValue}>{totalUsers}</p>
        </div>
        <div className={s.statCard}>
          <h3>Рестораны</h3>
          <p className={s.statValue}>{totalRestaurants}</p>
        </div>
        <div className={s.statCard}>
          <h3>Выручка</h3>
          <p className={s.statValue}>₽{formatNumber(totalRevenue)}</p>
        </div>
      </div>

      <div className={s.dashboardSections}>
        <div className={s.ordersSection}>
          <h3>Последние заказы</h3>
          <div className={s.ordersList}>
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className={s.orderItem}>
                  <div className={s.orderHeader}>
                    <span
                      onClick={() => handleOrderClick(order.id)}
                      className={s.orderNumber}
                    >
                      Заказ #{order.id}
                    </span>
                    <span
                      className={`${s.orderStatus} ${s[order.status]} ${s.mg}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className={s.orderDetails}>
                    <div className={s.orderInfo}>
                      <span className={s.orderDate}>
                        {formatDate(order.created_at)}
                      </span>
                      <span className={s.orderUser}>
                        Пользователь: {order.username}
                      </span>
                    </div>
                    <div className={s.orderAmount}>
                      ₽{formatNumber(order.total_amount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Нет недавних заказов</p>
            )}
          </div>
        </div>

        <div className={s.statsSection}>
          <div className={s.statusSummary}>
            <h3>Статусы заказов</h3>
            <div className={s.statusList}>
              {ordersByStatus && ordersByStatus.length > 0 ? (
                ordersByStatus.map((item) => (
                  <div key={item.status} className={s.statusItem}>
                    <div
                      className={`${s.statusIndicator} ${s[item.status]}`}
                    ></div>
                    <span className={s.statusName}>
                      {getStatusText(item.status)}
                    </span>
                    <span className={s.statusCount}>{item.count}</span>
                  </div>
                ))
              ) : (
                <p>Нет данных о статусах</p>
              )}
            </div>
          </div>

          <div className={s.topRestaurantsSection}>
            <h3>Популярные рестораны</h3>
            <div className={s.restaurantsList}>
              {topRestaurants && topRestaurants.length > 0 ? (
                topRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className={s.restaurantItem}>
                    <span className={s.restaurantName}>{restaurant.name}</span>
                    <span className={s.orderCount}>
                      Заказов: {restaurant.order_count}
                    </span>
                  </div>
                ))
              ) : (
                <p>Нет данных о популярных ресторанах</p>
              )}
            </div>
          </div>

          {topSpender && (
            <div className={s.topSpenderSection}>
              <h3>Лучший клиент</h3>
              <div className={s.topSpenderCard}>
                <div className={s.topSpenderInfo}>
                  {topSpender.profile_image ? (
                    <img
                      src={topSpender.profile_image}
                      alt={topSpender.username}
                      className={s.topSpenderAvatar}
                    />
                  ) : (
                    <img
                      src="/user-round.svg"
                      alt="Default user"
                      className={s.topSpenderAvatar}
                    />
                  )}

                  <div className={s.topSpenderName}>{topSpender.username}</div>
                  <div className={s.topSpenderContact}>
                    <div>{topSpender.email}</div>
                  </div>

                  <div className={s.topSpenderStatsRow}>
                    <div className={s.topSpenderStatItem}>
                      <span className={s.statLabel}>Заказов</span>
                      <span className={s.statValue}>
                        {topSpender.order_count}
                      </span>
                    </div>
                    <div className={s.topSpenderStatItem}>
                      <span className={s.statLabel}>Потрачено</span>
                      <span className={s.topSpenderAmount}>
                        ₽{formatNumber(topSpender.total_spent)}
                      </span>
                    </div>
                  </div>

                  <div className={s.topSpenderDate}>
                    С нами с{" "}
                    {formatRegistrationDate(topSpender.registration_date)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Новый блок для ежемесячной выручки */}
      <div className={s.monthlyRevenueSection}>
        <h3>Ежемесячная выручка</h3>
        {monthlyRevenue && monthlyRevenue.length > 0 ? (
          <>
            <div className={s.revenueChartContainer}>
              {monthlyRevenue.map((item) => (
                <div key={item.month} className={s.revenueBarWrapper}>
                  <div className={s.barLabel}>
                    {formatMonth(item.month).toLowerCase()}
                  </div>
                  <div
                    className={s.revenueBar}
                    style={{
                      height: `${
                        (parseFloat(item.revenue) / maxRevenue) * 180
                      }px`,
                    }}
                  ></div>
                  <div className={s.barValue}>
                    ₽{formatNumber(item.revenue)}
                  </div>
                </div>
              ))}
            </div>
            <div className={s.revenueTableContainer}>
              <div className={s.tableHeader}>
                <span>Месяц</span>
                <span>Выручка</span>
              </div>
              {monthlyRevenue.map((item) => (
                <div key={item.month} className={s.tableRow}>
                  <span>{formatMonth(item.month).toLowerCase()}</span>
                  <span className={s.revenueAmount}>
                    ₽{formatNumber(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Нет данных о ежемесячной выручке</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
