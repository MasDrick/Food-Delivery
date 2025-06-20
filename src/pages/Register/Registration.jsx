import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import { registerUser, clearError } from '../../store/slices/authSlice';
import s from './RegisterForm.module.scss';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Remove the error alert useEffect

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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const resultAction = await dispatch(registerUser(values));

      if (registerUser.rejected.match(resultAction)) {
        // Set form errors for field validation display
        if (resultAction.payload?.errors) {
          const apiErrors = {};
          resultAction.payload.errors.forEach((err) => {
            if (err.msg && err.msg.trim() !== '') {
              apiErrors[err.path] = err.msg;
            }
          });
          setErrors(apiErrors);
        }
      }
      // Remove success alert
    } catch (err) {
      console.error('Registration error:', err);
      // Remove error alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={s.registerContainer}>
      <div className={s.logoContainer}>
        <img src="/logo.svg" alt="logo" />
        <div className={s.logoText}>
          <h1>Порция Счастья</h1>
          <p>С любовью к вашему столу!</p>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className={s.registerForm}>
            <h2 className={s.title}>Регистрация</h2>

            {/* Remove the error display div since we're using notifications now */}

            <div className={s.formGroup}>
              <label htmlFor="username" className={s.label}>
                Имя пользователя
              </label>
              <Field
                type="text"
                name="username"
                id="username"
                className={s.input}
                placeholder="Введите имя пользователя"
              />
              <ErrorMessage name="username" component="div" className={s.error} />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="email" className={s.label}>
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={s.input}
                placeholder="Введите email"
              />
              <ErrorMessage name="email" component="div" className={s.error} />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="password" className={s.label}>
                Пароль
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={s.input}
                placeholder="Введите пароль"
              />
              <ErrorMessage name="password" component="div" className={s.error} />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="confirmPassword" className={s.label}>
                Подтвердите пароль
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={s.input}
                placeholder="Повторите пароль"
              />
              <ErrorMessage name="confirmPassword" component="div" className={s.error} />
            </div>

            <button type="submit" className={s.submitButton} disabled={isSubmitting || isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <div className={s.loginLink}>
              Уже есть аккаунт?{' '}
              <Link to="/login" className={s.loginLinkText}>
                Войти
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
