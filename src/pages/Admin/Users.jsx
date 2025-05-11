import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Percent,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  X,
} from "lucide-react";
import {
  fetchUsers,
  searchUsers,
  filterUsers,
  updateUser,
  deleteUser,
  makeAdmin,
  clearErrors,
  addUser, // Добавим новую функцию для добавления пользователя через админку
} from "../../store/slices/adminUsersSlice";
// Удалим этот импорт
// import { registerUser } from "../../store/slices/authSlice";
import s from "./Admin.module.scss";
import { IMaskInput } from "react-imask";
import AddUserModal from "../../components/AddUserModal/AddUserModal";

const Users = () => {
  const dispatch = useDispatch();
  // Обновите селектор, чтобы получить состояние загрузки и ошибки для добавления пользователя
  const {
    users,
    filteredUsers,
    loading,
    error,
    activeFilter,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    addUserLoading, // Добавьте это
    addUserError, // И это
  } = useSelector(
    (state) =>
      state.adminUsers || {
        users: [],
        filteredUsers: [],
        loading: false,
        error: null,
        activeFilter: "all",
        updateLoading: false,
        updateError: null,
        deleteLoading: false,
        deleteError: null,
        addUserLoading: false,
        addUserError: null,
      }
  );

  // Удалите этот селектор, так как он больше не нужен
  // const { loading: registerLoading, error: registerError } = useSelector(
  //   (state) => state.auth || { loading: false, error: null }
  // );

  const [searchTerm, setSearchTerm] = useState("");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'edit', 'delete', 'makeAdmin'
    userId: null,
    userData: null,
  });

  // Form state for editing user
  const [editForm, setEditForm] = useState({
    email: "",
    phone: "",
    discount_percent: 0,
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle adding a new user using the register action from authSlice
  // Update the import to use the correct export name from authSlice
  // Changed from 'register' to 'registerUser'

  // Then update the function call in handleAddUser
  // В функции handleAddUser
  const handleAddUser = (userData) => {
    return dispatch(addUser(userData))
      .unwrap()
      .then(() => {
        setShowAddUserModal(false);
        // Обновляем список пользователей после добавления
        return dispatch(fetchUsers());
      })
      .catch((error) => {
        console.error("Failed to add user:", error);
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchUsers(value));
  };

  const handleFilterChange = (filter) => {
    dispatch(filterUsers(filter));
  };

  const toggleActionMenu = (userId) => {
    setShowActionMenu(showActionMenu === userId ? null : userId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Некорректная дата";
      }

      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Ошибка даты";
    }
  };

  // Open modal based on action type
  const openModal = (type, userId) => {
    const user = filteredUsers.find((u) => u.id === userId);
    setModalState({
      isOpen: true,
      type,
      userId,
      userData: user,
    });

    if (type === "edit" && user) {
      setEditForm({
        email: user.email,
        phone: user.phone || "",
        discount_percent: user.discount_percent,
      });
    }

    setShowActionMenu(null);
  };

  // Close modal
  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      userId: null,
      userData: null,
    });
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  // Submit edit form
  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Prepare user data for update
    const userData = {
      id: modalState.userId,
      ...editForm,
    };

    dispatch(updateUser(userData))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
        // You could show an error message here
      });
  };

  // Confirm delete user
  const handleDeleteConfirm = () => {
    dispatch(deleteUser(modalState.userId))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to delete user:", error);
        // You could show an error message here
      });
  };

  // Confirm make admin
  const handleMakeAdminConfirm = () => {
    dispatch(makeAdmin(modalState.userId))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to make user admin:", error);
        // You could show an error message here
      });
  };

  // Clear any errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  if (loading && filteredUsers.length === 0) {
    return <div className={s.loading}>Загрузка пользователей...</div>;
  }

  if (error) {
    return <div className={s.errorContainer}>Ошибка: {error}</div>;
  }

  return (
    <div className={s.usersManagementContent}>
      <h2>Управление пользователями</h2>

      <div className={s.usersControls}>
        <div className={s.searchContainer}>
          <Search size={18} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Поиск пользователей..."
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
            <button
              className={`${s.filterButton} ${
                activeFilter === "admin" ? s.active : ""
              }`}
              onClick={() => handleFilterChange("admin")}
            >
              Администраторы
            </button>
            <button
              className={`${s.filterButton} ${
                activeFilter === "user" ? s.active : ""
              }`}
              onClick={() => handleFilterChange("user")}
            >
              Пользователи
            </button>
          </div>
        </div>

        {/* <button
          className={s.addUserButton}
          onClick={() => setShowAddUserModal(true)}
        >
          <UserPlus size={18} />
          <span>Добавить пользователя</span>
        </button> */}
      </div>

      <div className={s.usersGrid}>
        {filteredUsers.map((user) => (
          <div key={user.id} className={s.userCard}>
            <div className={s.userCardHeader}>
              <div className={s.userAvatar}>
                {user.profile_image ? (
                  <img src={user.profile_image} alt={user.email} />
                ) : (
                  <div className={s.userAvatarPlaceholder}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.role === "admin" && (
                  <div className={s.adminBadge}>
                    <Shield size={12} />
                  </div>
                )}
              </div>
              <div className={s.userInfo}>
                <h3 className={s.userName}>
                  {user.username || user.email.split("@")[0]}
                </h3>
                <span className={s.userEmail}>{user.email}</span>
              </div>
              <div className={s.userActions}>
                <button
                  className={s.actionButton}
                  onClick={() => toggleActionMenu(user.id)}
                >
                  <MoreVertical size={18} />
                </button>
                {showActionMenu === user.id && (
                  <div className={s.actionMenu}>
                    <button onClick={() => openModal("edit", user.id)}>
                      <Edit size={14} />
                      <span>Редактировать</span>
                    </button>
                    {user.role !== "admin" && (
                      <button onClick={() => openModal("makeAdmin", user.id)}>
                        <Shield size={14} />
                        <span>Сделать админом</span>
                      </button>
                    )}
                    <button
                      className={s.deleteButton}
                      onClick={() => openModal("delete", user.id)}
                    >
                      <Trash2 size={14} />
                      <span>Удалить</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={s.userCardBody}>
              <div className={s.userDetail}>
                <Phone size={16} />
                <span>{user.phone || "Не указан"}</span>
              </div>
              <div className={s.userDetail}>
                <Calendar size={16} />
                <span>
                  С нами с{" "}
                  {formatDate(user.created_at || user.registration_date)}
                </span>
              </div>
              <div className={s.userDetail}>
                <ShoppingBag size={16} />
                <span>Заказов: {user.orders_count}</span>
              </div>
              <div className={s.userDetail}>
                <Percent size={16} />
                <span>Скидка: {user.discount_percent}%</span>
              </div>
            </div>
            <div className={s.userCardFooter}>
              <div className={s.userStatus}>
                {user.orders_count > 5 ? (
                  <span className={s.loyalBadge}>Постоянный клиент</span>
                ) : user.orders_count > 0 ? (
                  <span className={s.activeBadge}>Активный</span>
                ) : (
                  <span className={s.newBadge}>Новый</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for user actions */}
      {modalState.isOpen && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <button className={s.modalClose} onClick={closeModal}>
              <X size={20} />
            </button>

            {/* Modal content based on type */}
            {modalState.type === "edit" && (
              <>
                <h3 className={s.modalTitle}>Редактирование пользователя</h3>
                {updateError && <p className={s.errorMessage}>{updateError}</p>}
                <form onSubmit={handleEditSubmit} className={s.editForm}>
                  <div className={s.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label>Телефон</label>
                    <IMaskInput
                      mask="+{7} (000) 000-00-00"
                      lazy={false}
                      value={editForm.phone}
                      onAccept={(value) =>
                        setEditForm({ ...editForm, phone: value })
                      }
                      placeholder="+7 (999) 999-99-99"
                      className={s.maskedInput}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label>Скидка (%)</label>
                    <input
                      type="number"
                      name="discount_percent"
                      value={editForm.discount_percent}
                      onChange={handleEditFormChange}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className={s.formActions}>
                    <button
                      type="button"
                      className={s.cancelButton}
                      onClick={closeModal}
                      disabled={updateLoading}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className={s.submitButton}
                      disabled={updateLoading}
                    >
                      {updateLoading ? "Сохранение..." : "Сохранить"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalState.type === "delete" && (
              <>
                <h3 className={s.modalTitle}>Удаление пользователя</h3>
                {deleteError && <p className={s.errorMessage}>{deleteError}</p>}
                <p className={s.modalMessage}>
                  Вы уверены, что хотите удалить пользователя{" "}
                  <strong>{modalState.userData?.email}</strong>? Это действие
                  нельзя отменить.
                </p>
                <div className={s.modalActions}>
                  <button
                    className={s.cancelButton}
                    onClick={closeModal}
                    disabled={deleteLoading}
                  >
                    Отмена
                  </button>
                  <button
                    className={s.deleteConfirmButton}
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Удаление..." : "Удалить"}
                  </button>
                </div>
              </>
            )}

            {modalState.type === "makeAdmin" && (
              <>
                <h3 className={s.modalTitle}>Назначение администратором</h3>
                {updateError && <p className={s.errorMessage}>{updateError}</p>}
                <p className={s.modalMessage}>
                  Вы уверены, что хотите назначить пользователя{" "}
                  <strong>{modalState.userData?.email}</strong> администратором?
                  Администратор получит доступ ко всем функциям управления
                  сайтом.
                </p>
                <div className={s.modalActions}>
                  <button
                    className={s.cancelButton}
                    onClick={closeModal}
                    disabled={updateLoading}
                  >
                    Отмена
                  </button>
                  <button
                    className={s.confirmButton}
                    onClick={handleMakeAdminConfirm}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Назначение..." : "Назначить"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddUser}
          isLoading={addUserLoading} // Используйте addUserLoading вместо registerLoading
          error={addUserError} // Используйте addUserError вместо registerError
        />
      )}
    </div>
  );
};

export default Users;
