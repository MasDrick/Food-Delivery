import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Use the same base URL as your other slices
const API_URL = 'http://localhost:3000/api';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Try with the correct API endpoint
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.log('Error fetching categories:', error);
      // Return fallback categories if API fails
      return [
        { id: 0, name: 'Все' },
        { id: 1, name: 'Итальянская' },
        { id: 2, name: 'Японская' },
        { id: 3, name: 'Американская' },
        { id: 4, name: 'Грузинская' },
        { id: 5, name: 'Веганская' },
        { id: 6, name: 'Стейк-хаус' },
        { id: 7, name: 'Рыбная' },
        { id: 8, name: 'Азиатская' },
        { id: 9, name: 'Европейская' }
      ];
    }
  }
);

export const fetchRestaurantsByCategory = createAsyncThunk(
  'categories/fetchRestaurantsByCategory',
  async (categoryId, { rejectWithValue, getState }) => {
    try {
      // If "All" category is selected, use all restaurants
      if (categoryId === 0) {
        const { restaurants } = getState().restaurants;
        return restaurants;
      }
      
      // Try with the correct API endpoint
      const response = await axios.get(`${API_URL}/categories/${categoryId}/restaurants`);
      return response.data;
    } catch (error) {
      console.log('Error fetching restaurants by category:', error);
      
      // Fallback: filter restaurants client-side if API fails
      const { restaurants } = getState().restaurants;
      
      // This is a simple fallback filter based on cuisine
      return restaurants.filter(restaurant => {
        if (!restaurant.cuisine) return false;
        
        const cuisine = restaurant.cuisine.toLowerCase();
        const categoryMap = {
          1: ['итальянская', 'пицца', 'паста'],
          2: ['японская', 'суши', 'роллы', 'азиатская'],
          3: ['американская', 'бургер', 'фастфуд'],
          4: ['грузинская', 'кавказская'],
          5: ['веганская', 'здоровая'],
          6: ['стейк', 'мясной'],
          7: ['рыбная', 'морепродукты'],
          8: ['азиатская', 'китайская', 'тайская'],
          9: ['европейская', 'средиземноморская']
        };
        
        const keywords = categoryMap[categoryId] || [];
        return keywords.some(keyword => cuisine.includes(keyword));
      });
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    filteredRestaurants: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCategoryFilter: (state) => {
      state.selectedCategory = null;
      state.filteredRestaurants = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: 'Ошибка при загрузке категорий' };
      })
      
      // Fetch restaurants by category
      .addCase(fetchRestaurantsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredRestaurants = action.payload;
        state.selectedCategory = action.meta.arg; // Store the selected category ID
      })
      .addCase(fetchRestaurantsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: 'Ошибка при загрузке ресторанов' };
      });
  },
});

export const { clearCategoryFilter } = categoriesSlice.actions;
export default categoriesSlice.reducer;