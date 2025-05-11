import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import {
  UserRound,
  ShoppingCart,
  ChefHat,
  Menu,
  X,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import Button from "../../ui/Button";
import { logoutUser } from "../../store/slices/authSlice";
import s from "./header.module.scss";

const Header = () => {
  const [activeLink, setActiveLink] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { userProfile, isLoading: profileLoading } = useSelector(
    (state) => state.profile || {}
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAdmin = userProfile?.role === "admin";

  // Get the username to display in the header
  const displayName = user?.username || "Пользователь";

  // Add a useEffect to fetch the user profile if needed
  useEffect(() => {
    // If authenticated but no profile data yet, fetch it
    if (isAuthenticated && !userProfile && !profileLoading) {
      // Assuming you have an action to fetch the profile
      // dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, userProfile, profileLoading, dispatch]);

  // Update active link based on current path when component mounts or path changes
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveLink(0);
    } else if (path === "/cart") {
      setActiveLink(1);
    } else if (path === "/profile" || path === "/admin") {
      setActiveLink(2);
    }
  }, [location.pathname]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle link click - add this function
  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Получаем корзину из Redux
  const cart = useSelector((state) => state.cart.restaurants);

  // Считаем общую сумму товаров в корзине
  const totalCartPrice = Object.values(cart).reduce((total, restaurant) => {
    return (
      total +
      Object.values(restaurant.items || {}).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    );
  }, 0);

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // Add these navigation functions
  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // Toggle dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={s.header}>
      <Link to="/">
        <div className={s.logo}>
          <img src="/logo.svg" alt="logoimg" />
          <div className={s.logoInfo}>
            <h1>Порция Счастья</h1>
            <p>С любовью к вашему столу!</p>
          </div>
        </div>
      </Link>

      <div className={s.mobileMenuToggle} onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      <div className={`${s.menuContainer} ${mobileMenuOpen ? s.open : ""}`}>
        {isAuthenticated ? (
          <div className={s.menu}>
            <ul className={s.nav}>
              <li>
                <Link
                  to="/"
                  className={activeLink === 0 ? s.active : ""}
                  onClick={() => handleLinkClick(0)}
                >
                  <ChefHat size={18} />
                  <span>Рестораны</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className={activeLink === 1 ? s.active : ""}
                  onClick={() => handleLinkClick(1)}
                >
                  <ShoppingCart size={18} />
                  <span>
                    {totalCartPrice > 0
                      ? `${formatPrice(totalCartPrice)} ₽`
                      : "Корзина"}
                  </span>
                </Link>
              </li>
              {isAdmin ? (
                <li
                  className={s.adminDropdown}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`${s.dropdownToggle} ${s.admin} ${
                      activeLink === 2 || location.pathname === "/admin"
                        ? s.active
                        : ""
                    }`}
                    onClick={toggleDropdown}
                  >
                    <UserRound size={18} />
                    <span>{displayName}</span>
                    <ChevronDown size={16} />
                  </div>

                  {isDropdownOpen && (
                    <div className={s.dropdownMenu}>
                      <Link
                        to="/profile"
                        className={s.dropdownItem}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLinkClick(2);
                        }}
                      >
                        <UserRound size={16} />
                        <span>Профиль</span>
                      </Link>
                      <Link
                        to="/admin"
                        className={`${s.dropdownItem} ${s.adminItem}`}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          // Don't set activeLink here to keep the dropdown highlighted
                        }}
                      >
                        <Settings size={16} />
                        <span>Админ панель</span>
                      </Link>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <Link
                    to="/profile"
                    className={activeLink === 2 ? s.active : ""}
                    onClick={() => handleLinkClick(2)}
                  >
                    <UserRound size={18} />
                    <span>{displayName}</span>
                  </Link>
                </li>
              )}
            </ul>
            <Button name={"Выйти"} onClick={handleLogout} />

            {/* Add theme toggle button */}
          </div>
        ) : (
          <div className={s.authButtons}>
            <Button name={"Регистрация"} onClick={handleRegister} />
            <Button name={"Войти"} onClick={handleLogin} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
