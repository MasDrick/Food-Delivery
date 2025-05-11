import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import s from '../../pages/Admin/Admin.module.scss';

const AddUserModal = ({ isOpen, onClose, onAddUser, isLoading, error }) => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Имя пользователя должно быть не менее 3 символов')
      .max(20, 'Имя пользователя должно быть не более 20 символов')
      .required('Обязательное поле'),
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Пароль должен быть не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Подтвердите пароль'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Sending registration data:', values);
      await onAddUser(values);
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalContent}>
        <button className={s.modalClose} onClick={onClose}>
          <X size={20} />
        </button>
        
        <h3 className={s.modalTitle}>Добавление пользователя</h3>
        
        {error && <p className={s.errorMessage}>{error}</p>}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={s.editForm}>
              <div className={s.formGroup}>
                <label htmlFor="username">Имя пользователя</label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Введите имя пользователя"
                />
                <ErrorMessage name="username" component="div" className={s.error} />
              </div>

              <div className={s.formGroup}>
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Введите email"
                />
                <ErrorMessage name="email" component="div" className={s.error} />
              </div>

              <div className={s.formGroup}>
                <label htmlFor="password">Пароль</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Введите пароль"
                />
                <ErrorMessage name="password" component="div" className={s.error} />
              </div>

              <div className={s.formGroup}>
                <label htmlFor="confirmPassword">Подтвердите пароль</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Повторите пароль"
                />
                <ErrorMessage name="confirmPassword" component="div" className={s.error} />
              </div>

              <div className={s.formActions}>
                <button 
                  type="button" 
                  className={s.cancelButton} 
                  onClick={onClose}
                  disabled={isSubmitting || isLoading}
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className={s.submitButton} 
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? 'Добавление...' : 'Добавить пользователя'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUserModal;