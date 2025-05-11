import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import restaurantReducer from "./slices/restaurantSlice";
import categoriesReducer from "./slices/categoriesSlice";
import profileReducer from "./slices/profileSlice"; // Changed from profileSlice to profileslice
import themeReducer from "./slices/themeSlice";
import cartReducer, { cartLocalStorageMiddleware } from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import notificationReducer from "./slices/notificationSlice";
import dashboardReducer from "./slices/dashboardSlice";
import adminOrdersReducer from "./slices/adminOrdersSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import messageReducer from "./features/messages/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    categories: categoriesReducer,
    theme: themeReducer,
    profile: profileReducer, // Make sure this is included
    cart: cartReducer,
    orders: orderReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer,
    adminOrders: adminOrdersReducer,
    adminUsers: adminUsersReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(cartLocalStorageMiddleware),
});

export default store;
