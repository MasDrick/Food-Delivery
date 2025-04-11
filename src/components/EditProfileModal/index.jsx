import React from 'react';
import { X } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import s from './EditProfileModal.module.scss';

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  editField, 
  fieldValue, 
  setFieldValue, 
  validationError, 
  onSave, 
  isLoading 
}) => {
  if (!isOpen) return null;

  const getFieldLabel = () => {
    switch (editField) {
      case 'phone':
        return 'Номер телефона';
      case 'card_number':
        return 'Номер карты';
      case 'profile_image':
        return 'URL изображения профиля';
      default:
        return 'Значение';
    }
  };

  const getFieldPlaceholder = () => {
    switch (editField) {
      case 'phone':
        return '+7 (999) 999-99-99';
      case 'card_number':
        return '0000 0000 0000 0000';
      case 'profile_image':
        return 'https://example.com/image.jpg';
      default:
        return '';
    }
  };

  const getModalTitle = () => {
    switch (editField) {
      case 'phone':
        return 'Редактирование номера телефона';
      case 'card_number':
        return 'Редактирование номера карты';
      case 'profile_image':
        return 'Изменение фото профиля';
      default:
        return 'Редактирование';
    }
  };

  const getMaskOptions = () => {
    switch (editField) {
      case 'phone':
        return {
          mask: '+{7} (000) 000-00-00',
          lazy: false
        };
      case 'card_number':
        return {
          mask: '0000 0000 0000 0000',
          lazy: false
        };
      default:
        return {};
    }
  };

  // Function to handle input change
  const handleAccept = (value, mask) => {
    if (editField === 'card_number') {
      // Remove spaces for storage but keep them for display
      setFieldValue(value.replace(/\s/g, ''));
    } else {
      setFieldValue(value);
    }
  };

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h3>{getModalTitle()}</h3>
          <button className={s.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={s.formGroup}>
          <label>{getFieldLabel()}</label>
          {editField === 'phone' || editField === 'card_number' ? (
            <IMaskInput
              {...getMaskOptions()}
              value={fieldValue}
              onAccept={handleAccept}
              placeholder={getFieldPlaceholder()}
              className={s.maskedInput}
            />
          ) : (
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              placeholder={getFieldPlaceholder()}
              className={s.input}
            />
          )}
          {validationError && <div className={s.error}>{validationError}</div>}
        </div>
        
        <div className={s.modalActions}>
          <button className={s.cancelButton} onClick={onClose}>
            Отмена
          </button>
          <button 
            className={s.saveButton} 
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;