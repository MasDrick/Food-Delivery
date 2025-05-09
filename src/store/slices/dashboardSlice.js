import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Base URL for API requests
const API_URL = `${API_BASE_URL}/api`;

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      
      // Добавляем заголовок авторизации к запросу
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Также нужно добавить заголовки авторизации к другим запросам
export const fetchUserStats = createAsyncThunk(
  'dashboard/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/dashboard/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRestaurantStats = createAsyncThunk(
  'dashboard/fetchRestaurantStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/dashboard/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  // General dashboard stats
  totalOrders: 0,
  totalUsers: 0,
  totalRestaurants: 0,
  totalRevenue: "0.00",
  ordersByStatus: [],
  recentOrders: [],
  topRestaurants: [],
  monthlyRevenue: [],
  
  // User statistics
  newUsersLast30Days: 0,
  topUsers: [],
  
  // Restaurant statistics
  topSellingItems: [],
  
  // Loading and error states
  loading: false,
  userStatsLoading: false,
  restaurantStatsLoading: false,
  error: null,
  userStatsError: null,
  restaurantStatsError: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Main dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        // Instead of returning a new object, update the state directly
        Object.assign(state, action.payload);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      })
      
      // User statistics
      .addCase(fetchUserStats.pending, (state) => {
        state.userStatsLoading = true;
        state.userStatsError = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStatsLoading = false;
        state.newUsersLast30Days = action.payload.newUsersLast30Days;
        state.topUsers = action.payload.topUsers;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.userStatsLoading = false;
        state.userStatsError = action.payload || 'Failed to fetch user statistics';
      })
      
      // Restaurant statistics
      .addCase(fetchRestaurantStats.pending, (state) => {
        state.restaurantStatsLoading = true;
        state.restaurantStatsError = null;
      })
      .addCase(fetchRestaurantStats.fulfilled, (state, action) => {
        state.restaurantStatsLoading = false;
        state.topSellingItems = action.payload.topSellingItems;
      })
      .addCase(fetchRestaurantStats.rejected, (state, action) => {
        state.restaurantStatsLoading = false;
        state.restaurantStatsError = action.payload || 'Failed to fetch restaurant statistics';
      });
  },
});

export default dashboardSlice.reducer;