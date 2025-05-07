import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Users, ShoppingBag, Settings, BarChart2 } from "lucide-react";
import s from "./Admin.module.scss";

const AdminPanel = () => {
  const { userProfile } = useSelector((state) => state.profile || {});
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user is admin
  if (!userProfile || userProfile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className={s.dashboardContent}>
            <h2>Панель управления</h2>
            <div className={s.statsGrid}>
              <div className={s.statCard}>
                <h3>Всего заказов</h3>
                <p className={s.statValue}>245</p>
              </div>
              <div className={s.statCard}>
                <h3>Активных пользователей</h3>
                <p className={s.statValue}>128</p>
              </div>
              <div className={s.statCard}>
                <h3>Рестораны</h3>
                <p className={s.statValue}>18</p>
              </div>
              <div className={s.statCard}>
                <h3>Выручка</h3>
                <p className={s.statValue}>₽156,890</p>
              </div>
            </div>
            <div className={s.recentActivity}>
              <h3>Последние действия</h3>
              <div className={s.activityList}>
                <div className={s.activityItem}>
                  <span className={s.activityTime}>10:45</span>
                  <span className={s.activityText}>
                    Новый заказ #1234 создан
                  </span>
                </div>
                <div className={s.activityItem}>
                  <span className={s.activityTime}>09:30</span>
                  <span className={s.activityText}>
                    Пользователь Иван зарегистрировался
                  </span>
                </div>
                <div className={s.activityItem}>
                  <span className={s.activityTime}>08:15</span>
                  <span className={s.activityText}>Заказ #1230 выполнен</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className={s.ordersContent}>
            <h2>Управление заказами</h2>
            <p>Здесь будет список заказов и возможность управления ими.</p>
          </div>
        );
      case "users":
        return (
          <div className={s.usersContent}>
            <h2>Управление пользователями</h2>
            <p>
              Здесь будет список пользователей и возможность управления ими.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className={s.settingsContent}>
            <h2>Настройки</h2>
            <p>Здесь будут настройки администратора.</p>
          </div>
        );
      default:
        return <div>Выберите раздел</div>;
    }
  };

  return (
    <div className={s.adminContainer}>
      <div className={s.sidebar}>
        <div className={s.sidebarHeader}>
          <h2>Админ панель</h2>
        </div>
        <nav className={s.sidebarNav}>
          <button
            className={`${s.navItem} ${
              activeTab === "dashboard" ? s.active : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart2 size={20} />
            <span>Дашборд</span>
          </button>
          <button
            className={`${s.navItem} ${activeTab === "orders" ? s.active : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={20} />
            <span>Заказы</span>
          </button>
          <button
            className={`${s.navItem} ${activeTab === "users" ? s.active : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} />
            <span>Пользователи</span>
          </button>
          <button
            className={`${s.navItem} ${
              activeTab === "settings" ? s.active : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} />
            <span>Настройки</span>
          </button>
        </nav>
      </div>
      <div className={s.content}>{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
