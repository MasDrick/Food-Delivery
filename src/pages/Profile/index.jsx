import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, CreditCard, Edit2, ShoppingBag, Mail, Calendar, Percent } from 'lucide-react';
import { fetchUserProfile, updateUserProfile, fetchOrderHistory } from '../../store/slices/profileSlice';
import EditProfileModal from '../../components/EditProfileModal';
import { API_BASE_URL } from '../../config/api';
import s from './profile.module.scss';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import OrderHistoryCard from '../../components/OrderHistoryCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile, orderHistory, isLoading, error, updateSuccess } = useSelector((state) => state.profile || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchOrderHistory());

  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setIsModalOpen(false);
    }
  }, [updateSuccess]);

  const handleEditClick = (field) => {
    setEditField(field);
    // Получаем значение напрямую из userProfile
    setFieldValue(userProfile?.[field] || '');
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Validate field
    if (editField === 'phone' && !fieldValue.match(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)) {
      setValidationError('Введите корректный номер телефона');
      return;
    }
    
    // Создаем объект с полными данными профиля
    const updateData = {
      ...userProfile,  // Сохраняем все существующие данные профиля
    };
    
    // Обрабатываем изображение профиля особым образом
    if (editField === 'profile_image') {
      // Если это URL-адрес изображения
      updateData[editField] = fieldValue;
    } else {
      // Для других полей просто обновляем значение
      updateData[editField] = fieldValue;
    }
    
    dispatch(updateUserProfile(updateData));
  };

  if (isLoading && !userProfile) {
    return <div className={s.loading}>Загрузка профиля...</div>;
  }

  if (error && !userProfile) {
    return <div className={s.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={s.profileContainer}>
      <div className={s.profileHeader}>
        <h1>Личный кабинет</h1>
      </div>

      <div className={s.profileContent}>
        <div className={s.userInfoSection}>
          <div className={s.avatarContainer}>
            <div className={s.userAvatar}>
              {userProfile?.profile_image ? (
                <img 
                  src={userProfile.profile_image} 
                  alt="Аватар пользователя" 
                  className={s.avatarImage}
                />
              ) : (
                <User size={40} />
              )}
              <button 
                className={s.editAvatarButton}
                onClick={() => handleEditClick('profile_image')}
                aria-label="Изменить аватар"
              >
                <Edit2 size={20} />
              </button>
            </div>
            <p className={s.userName}>{userProfile?.username || 'Пользователь'}</p>
          </div>

          <div className={s.userDetails}>
            <div className={s.userInfo}>
              <div className={s.infoItem}>
                <Mail />
                <span>
                  {userProfile?.email || 'Email не указан'}
                </span>
              </div>
              
              <div className={s.infoItem}>
                <Phone />
                <span>
                  {userProfile?.phone || 'Телефон не указан'}
                </span>
                <button 
                  className={s.editButton}
                  onClick={() => handleEditClick('phone')}
                  aria-label="Редактировать телефон"
                >
                  <Edit2 />
                </button>
              </div>
              
              <div className={s.infoItem}>
                <CreditCard />
                <span className={s.maskedCardNumber}>
                  {userProfile?.card_number 
                    ? `**** **** **** ${userProfile.card_number.slice(-4)}` 
                    : 'Карта не указана'}
                </span>
                <button 
                  className={s.editButton}
                  onClick={() => handleEditClick('card_number')}
                  aria-label="Редактировать карту"
                >
                  <Edit2 />
                </button>
              </div>
              
              <div className={s.infoItem}>
                <Percent />
                <span>
                  Скидка: {Math.round(userProfile?.discount_percent || 0)}%
                </span>
              </div>
              
              <div className={s.infoItem}>
                <Calendar />
                <span>
                  Дата регистрации: {userProfile?.created_at 
                    ? new Date(userProfile.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Не указана'}
                </span>
              </div>
              
              <div className={s.infoItem}>
                <ShoppingBag />
                <span>
                  Количество заказов: {userProfile?.orders_count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.orderHistorySection}>
          <div className={s.historyTitle}>
            <h2>История заказов</h2>
          </div>
          {orderHistory && orderHistory.length > 0 ? (
            <div className={s.ordersList}>
              {orderHistory.map((order) => (
                <OrderHistoryCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className={s.emptyOrders}>
              <p>У вас пока нет заказов</p>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editField={editField}
        fieldValue={fieldValue}
        setFieldValue={setFieldValue}
        validationError={validationError}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Profile;
