import { createSlice } from "@reduxjs/toolkit";

// Функции для работы с localStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load cart state", err);
    return undefined;
  }
};

const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch (err) {
    console.error("Could not save cart state", err);
  }
};

// Загружаем начальное состояние из localStorage, если оно есть
const persistedState = loadCartState();
const initialState = persistedState || {
  restaurants: {},
  pendingItem: null,
  showRestaurantChangeConfirmation: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { restaurantId, restaurantName, item } = action.payload;

      // Initialize restaurant in cart if it doesn't exist
      if (!state.restaurants[restaurantId]) {
        state.restaurants[restaurantId] = {
          id: restaurantId,
          name: restaurantName,
          items: {},
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
    },
  },
});

// Middleware для автоматического сохранения состояния в localStorage
export const cartLocalStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("cart/")) {
    saveCartState(store.getState().cart);
  }
  return result;
};

export const { addToCart, clearCart, clearRestaurantItems } = cartSlice.actions;

export default cartSlice.reducer;
