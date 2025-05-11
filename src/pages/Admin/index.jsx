import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { Users, ShoppingBag, Settings as SettingsIcon, BarChart2 } from "lucide-react";
import { fetchDashboardData } from "../../store/slices/dashboardSlice";
import { fetchAdminOrders } from "../../store/slices/adminOrdersSlice";
import { fetchUserProfile } from "../../store/slices/profileSlice";
import s from "./Admin.module.scss";
import Dashboard from "./Dashboard"; 
import Orders from "./Orders"; 
import UsersManagement from "./Users"; 
import Settings from "./Settings"; 

const AdminPanel = () => {
  const { userProfile, loading: profileLoading } = useSelector((state) => state.profile || {});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check authentication on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch user profile if not available
    if (!userProfile) {
      dispatch(fetchUserProfile())
        .unwrap()
        .then(profile => {
          if (profile.role !== 'admin') {
            navigate('/');
          }
          setIsLoading(false);
        })
        .catch(() => {
          navigate('/');
        });
    } else {
      setIsLoading(false);
    }
  }, [dispatch, navigate, userProfile]);

  // Load data based on active tab
  useEffect(() => {
    if (!isLoading && userProfile?.role === 'admin') {
      if (activeTab === "dashboard") {
        dispatch(fetchDashboardData());
      } else if (activeTab === "orders") {
        dispatch(fetchAdminOrders());
      }
    }
  }, [activeTab, dispatch, isLoading, userProfile]);

  // Show loading while checking authentication
  if (isLoading || profileLoading) {
    return <div className={s.loadingContainer}>Загрузка...</div>;
  }

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
        return <UsersManagement />;
      case "settings":
        return <Settings />;
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
            <SettingsIcon size={20} />
            <span>Настройки</span>
          </button>
        </nav>
      </div>
      <div className={s.content}>{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
