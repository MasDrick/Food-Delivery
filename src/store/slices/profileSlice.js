import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Base URL for API requests
const API_URL = `${API_BASE_URL}/api`;

// Получение профиля пользователя
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Не авторизован');
      }
      
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить профиль');
    }
  }
);

// Обновление профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { profile } = getState();
      
      // Отправляем полный профиль с обновленными данными
      const fullUserData = {
        ...profile.userProfile,  // Все существующие данные профиля
        ...userData              // Обновляемые поля
      };
      
      const response = await axios.put(`${API_URL}/users/profile`, fullUserData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      // Возвращаем обновленный профиль
      return {
        ...profile.userProfile,  // Сохраняем существующие данные
        ...response.data         // Обновляем новыми данными
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось обновить профиль');
    }
  }
);



// Добавление адреса
export const addUserAddress = createAsyncThunk(
  'profile/addUserAddress',
  async (addressData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/profile/addresses`, addressData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось добавить адрес');
    }
  }
);

// Получение истории заказов
export const fetchOrderHistory = createAsyncThunk(
  'profile/fetchOrderHistory',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      // Исправляем endpoint на /users/profile/orders
      const response = await axios.get(`${API_URL}/users/profile/orders`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить историю заказов');
    }
  }
);

const initialState = {
  userProfile: null,
  orderHistory: [],
  isLoading: false,
  error: null,
  updateSuccess: false
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      // Remove this duplicate case
      // .addCase(updateUserProfile.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.userProfile = action.payload;
      //   state.error = null;
      //   state.updateSuccess = true;
      // })
      
      // Add address cases
      .addCase(addUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserAddress.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // We'll refresh the profile to get updated addresses
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch order history cases
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// At the end of your file, make sure you have:
export const { clearProfileError, resetUpdateSuccess } = profileSlice.actions;
export default profileSlice.reducer; // This line is crucial