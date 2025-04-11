import { configureStore } from '@reduxjs/toolkit';
// Import your existing reducers
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import categoriesReducer from './slices/categoriesSlice';
import profileReducer from './slices/profileSlice';
// Import the new theme reducer
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    categories: categoriesReducer,
    theme: themeReducer,
    profile: profileReducer
    // ... any other reducers you have
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;