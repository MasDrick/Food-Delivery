import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Phone, Mail, CreditCard, Percent, Calendar, ShoppingBag, Pencil, X } from 'lucide-react';
import { fetchUserProfile, updateUserProfile, resetUpdateSuccess, fetchOrderHistory } from '../../store/slices/profileSlice';
import OrderHistory from '../../components/OrderHistory';
import s from './profile.module.scss';
import EditProfileModal from '../../components/EditProfileModal';

const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile, orderHistory, isLoading, error, updateSuccess } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Fetch user profile data when component mounts
    dispatch(fetchUserProfile());
    // Fetch order history when component mounts
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  // Reset success message when modal closes
  useEffect(() => {
    if (!isModalOpen && updateSuccess) {
      dispatch(resetUpdateSuccess());
    }
  }, [isModalOpen, updateSuccess, dispatch]);

  const handleEditField = (field, currentValue) => {
    setEditField(field);
    setFieldValue(currentValue || '');
    setValidationError('');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditField(null);
    setFieldValue('');
    setValidationError('');
  };
  
  const validateField = () => {
    if (editField === 'phone') {
      // For phone, we'll check if it has the correct format
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(fieldValue)) {
        setValidationError('Введите корректный номер телефона');
        return false;
      }
    }
    
    if (editField === 'card_number') {
      // For card number, we'll check if it has 16 digits
      if (fieldValue.length !== 16 || !/^\d+$/.test(fieldValue)) {
        setValidationError('Введите корректный номер карты (16 цифр)');
        return false;
      }
    }
    
    // Removed the profile_image validation
    
    return true;
  };
  
  const handleSave = () => {
    if (!validateField()) return;
    
    const updateData = {
      [editField]: fieldValue
    };
    
    dispatch(updateUserProfile(updateData));
    closeModal();
  };

  if (isLoading && !userProfile) {
    return <div className={s.loading}>Загрузка профиля...</div>;
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
                  alt={userProfile?.username || user?.username} 
                  className={s.avatarImage}
                />
              ) : (
                <User size={40} />
              )}
              <button 
                className={s.editAvatarButton} 
                onClick={() => handleEditField('profile_image', userProfile?.profile_image)}
              >
                <Pencil size={16} />
              </button>
            </div>
            <h2 className={s.userName}>{userProfile?.username || user?.username}</h2>
          </div>
          
          <div className={s.userDetails}>
            <div className={s.userInfo}>
              <div className={s.infoItem}>
                <Mail />
                <span>{userProfile?.email || user?.email}</span>
              </div>
              
              <div className={s.infoItem}>
                <Phone />
                <span>{userProfile?.phone || 'Не указан'}</span>
                <button className={s.editButton} onClick={() => handleEditField('phone', userProfile?.phone)}>
                  <Pencil />
                </button>
              </div>
              
              <div className={s.infoItem}>
                <CreditCard />
                <span>
                  {userProfile?.card_number 
                    ? <span className={s.maskedCardNumber}>
                        {'•••• •••• •••• ' + userProfile.card_number.slice(-4)}
                      </span> 
                    : 'Не указана'}
                </span>
                <button className={s.editButton} onClick={() => handleEditField('card_number', userProfile?.card_number)}>
                  <Pencil />
                </button>
              </div>
              
              <div className={s.infoItem}>
                <Percent />
                <span>Персональная скидка: {userProfile?.discount_percent || '0'}%</span>
              </div>
              
              <div className={s.infoItem}>
                <Calendar />
                <span>Дата регистрации: {new Date(userProfile?.created_at || user?.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className={s.infoItem}>
                <ShoppingBag />
                <span>Количество заказов: {userProfile?.orders_count || '0'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <OrderHistory 
          isLoading={isLoading} 
          orders={orderHistory} 
          ordersCount={userProfile?.orders_count || 0} 
        />
      </div>
      
      {error && !isLoading && (
        <div className={s.errorMessage}>
          Ошибка: {error}
        </div>
      )}
      
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
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