import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { clearCart } from './cartSlice';

// Base URL for API requests
const API_URL = `${API_BASE_URL}/api`;

// Async thunk для создания заказа
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, dispatch, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('token');
      
      // Modify the orderData to match the expected backend structure
      // Remove the comment field if the database doesn't have this column
      const modifiedOrderData = {
        ...orderData,
        // If you need to store the comment, you could add it to another field
        // that exists in your database, for example:
        // delivery_notes: orderData.comment
      };
      
      // If you don't need the comment at all, you can delete it
      if (modifiedOrderData.comment !== undefined) {
        delete modifiedOrderData.comment;
      }
      
      console.log('Sending modified order data:', modifiedOrderData);
      
      const response = await axios.post(`${API_URL}/orders`, modifiedOrderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Очищаем корзину после успешного создания заказа
      dispatch(clearCart());
      
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      return rejectWithValue(error.response?.data?.message || 'Ошибка при создании заказа');
    }
  }
);

// Async thunk для получения заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Пользователь не авторизован');
      }
      
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении заказов');
    }
  }
);

// Async thunk для получения деталей заказа
export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Пользователь не авторизован');
      }
      
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении деталей заказа');
    }
  }
);

const initialState = {
  currentOrder: null,
  userOrders: [],
  isLoading: false,
  error: null,
  orderSuccess: false
};

// Selector for user order history
export const selectUserOrders = (state) => state.orders.userOrders;

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.orderSuccess = false;
    },
    // Optional: clear userOrders (for logout, etc.)
    clearUserOrders: (state) => {
      state.userOrders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orderSuccess = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orderSuccess = false;
      })
      
      // Fetch user orders cases
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch order details cases
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrderError, resetOrderSuccess, clearUserOrders } = orderSlice.actions;
export default orderSlice.reducer;