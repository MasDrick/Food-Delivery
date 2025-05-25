import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Update API_URL to match your backend port
const API_URL = `${API_BASE_URL}/api`;

export const fetchAvailableOrders = createAsyncThunk(
  'courier/fetchAvailableOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // Updated endpoint to match backend route
      const response = await axios.get(`${API_URL}/courier/available-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.data) {
        return rejectWithValue('Нет данных от сервера');
      }
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Ошибка при загрузке заказов'
      );
    }
  }
);

export const fetchCourierOrders = createAsyncThunk(
  'courier/fetchCourierOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // Updated endpoint to match backend route
      const response = await axios.get(`${API_URL}/courier/my-deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'courier/acceptOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // Updated endpoint to match backend route
      const response = await axios.post(
        `${API_URL}/courier/assign/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update order status (for pickup/delivery completion)
export const updateOrderStatus = createAsyncThunk(
  'courier/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/courier/complete/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Status update error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  availableOrders: [],
  courierOrders: [],
  isLoading: false,
  error: null,
  activeOrder: null,
};

const courierSlice = createSlice({
  name: 'courier',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAvailableOrders
      .addCase(fetchAvailableOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableOrders = action.payload;
      })
      .addCase(fetchAvailableOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.availableOrders = [];
      })

      // Handle fetchCourierOrders
      .addCase(fetchCourierOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourierOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courierOrders = action.payload;
      })
      .addCase(fetchCourierOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle acceptOrder
      .addCase(acceptOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeOrder = action.payload;
        state.availableOrders = state.availableOrders.filter(
          (order) => order.id !== action.payload.id
        );
        state.courierOrders.push(action.payload);
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courierOrders = state.courierOrders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        if (state.activeOrder?.id === action.payload.id) {
          state.activeOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = courierSlice.actions;
export default courierSlice.reducer;