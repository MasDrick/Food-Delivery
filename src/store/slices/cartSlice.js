import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurants: {},
  pendingItem: null,
  showRestaurantChangeConfirmation: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { restaurantId, restaurantName, item } = action.payload;
      
      // Initialize restaurant in cart if it doesn't exist
      if (!state.restaurants[restaurantId]) {
        state.restaurants[restaurantId] = {
          id: restaurantId,
          name: restaurantName,
          items: {}
        };
      }
      
      // If quantity is 0, remove the item
      if (item.quantity === 0) {
        delete state.restaurants[restaurantId].items[item.id];
        
        // If no items left for this restaurant, remove the restaurant
        if (Object.keys(state.restaurants[restaurantId].items).length === 0) {
          delete state.restaurants[restaurantId];
        }
        return;
      }
      
      // Add or update the item
      state.restaurants[restaurantId].items[item.id] = item;
    },
    
    clearRestaurantItems: (state, action) => {
      const { restaurantId } = action.payload;
      if (state.restaurants[restaurantId]) {
        delete state.restaurants[restaurantId];
      }
    },
    
    clearCart: (state) => {
      state.restaurants = {};
      state.pendingItem = null;
      state.showRestaurantChangeConfirmation = false;
    }
  }
});

export const { 
  addToCart, 
  clearCart,
  clearRestaurantItems
} = cartSlice.actions;

export default cartSlice.reducer;