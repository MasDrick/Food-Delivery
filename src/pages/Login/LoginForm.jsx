import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import { loginUser, clearError } from '../../store/slices/authSlice';
import s from './LoginForm.module.scss';

const LoginForm = () => {
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

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    password: Yup.string().required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const resultAction = await dispatch(loginUser(values));
    
    if (loginUser.rejected.match(resultAction)) {
      if (resultAction.payload?.errors) {
        const formErrors = {};
        resultAction.payload.errors.forEach((err) => {
          formErrors[err.path] = err.msg;
        });
        setErrors(formErrors);
      }
    }
    
    setSubmitting(false);
  };

  return (
    <div className={s.loginContainer}>
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
          <Form className={s.loginForm}>
            <h2 className={s.title}>Вход в аккаунт</h2>

            {error && !error.errors && (
              <div className={s.error} style={{ marginBottom: '15px', textAlign: 'center' }}>
                {error.message || 'Ошибка авторизации'}
              </div>
            )}

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

            {/* Removed "Remember me" and "Forgot password" section */}

            <button type="submit" className={s.submitButton} disabled={isSubmitting || isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <div className={s.registerLink}>
              Нет аккаунта?{' '}
              <Link to="/register">Зарегистрируйтесь</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
