import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router";
import { Users, ShoppingBag, Settings, BarChart2 } from "lucide-react";
import { fetchDashboardData } from "../../store/slices/dashboardSlice";
import { fetchAdminOrders } from "../../store/slices/adminOrdersSlice";
import s from "./Admin.module.scss";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import Orders from "./Orders"; // Import the Orders component

const AdminPanel = () => {
  const { userProfile } = useSelector((state) => state.profile || {});
  const [activeTab, setActiveTab] = useState("dashboard");
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeTab === "dashboard") {
      dispatch(fetchDashboardData());
    } else if (activeTab === "orders") {
      dispatch(fetchAdminOrders());
    }
  }, [activeTab, dispatch]);

  // Check if user is admin
  if (!userProfile || userProfile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
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
