import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import configureStore from 'redux-mock-store';
import Header from './index';

const mockStore = configureStore([]);

describe('Header Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null,
      },
      profile: {
        userProfile: null,
        isLoading: false,
      },
      cart: {
        restaurants: {},
      },
    });
  });

  const renderHeader = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>,
    );
  };

  test('отображает логотип', () => {
    renderHeader();
    expect(screen.getByAltText('logoimg')).toBeInTheDocument();
    expect(screen.getByText('Порция Счастья')).toBeInTheDocument();
  });

  test('отображает кнопки авторизации для неавторизованного пользователя', () => {
    renderHeader();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  test('отображает меню для авторизованного пользователя', () => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'TestUser' },
      },
      profile: {
        userProfile: { role: 'user' },
        isLoading: false,
      },
      cart: {
        restaurants: {},
      },
    });

    renderHeader();
    expect(screen.getByText('Рестораны')).toBeInTheDocument();
    expect(screen.getByText('Корзина')).toBeInTheDocument();
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  test('отображает админ-меню для администратора', () => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'AdminUser' },
      },
      profile: {
        userProfile: { role: 'admin' },
        isLoading: false,
      },
      cart: {
        restaurants: {},
      },
    });

    renderHeader();
    const adminButton = screen.getByText('AdminUser');
    fireEvent.click(adminButton);
    expect(screen.getByText('Панель админа')).toBeInTheDocument();
  });

  test('корректно отображает цену корзины', () => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'TestUser' },
      },
      profile: {
        userProfile: { role: 'user' },
        isLoading: false,
      },
      cart: {
        restaurants: {
          1: {
            items: {
              1: { price: 100, quantity: 2 },
              2: { price: 150, quantity: 1 },
            },
          },
        },
      },
    });

    renderHeader();
    expect(screen.getByText('350 ₽')).toBeInTheDocument();
  });
});
