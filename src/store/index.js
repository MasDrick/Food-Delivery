import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import categoriesReducer from './slices/categoriesSlice';
import profileReducer from './slices/profileSlice'; // Changed from profileSlice to profileslice
import themeReducer from './slices/themeSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    categories: categoriesReducer,
    theme: themeReducer,
    profile: profileReducer, // Make sure this is included
    cart: cartReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;
