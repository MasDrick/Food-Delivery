import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

// Base URL for API requests
const API_URL = `${API_BASE_URL}/api`;

// Async thunk for fetching all orders
export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/orders/stats`, {
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

// Async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.order; // Ensure we're returning the order object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  orders: [],
  filteredOrders: [],
  activeFilter: "all",
  loading: false,
  error: null,
  statusOptions: [
    { value: "pending", label: "В обработке" },
    { value: "processing", label: "Готовится" },
    { value: "delivering", label: "Доставляется" },
    { value: "completed", label: "Выполнен" },
    { value: "cancelled", label: "Отменен" },
  ],
};

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    filterOrders: (state, action) => {
      const filter = action.payload;
      state.activeFilter = filter;

      if (filter === "all") {
        state.filteredOrders = state.orders;
      } else {
        state.filteredOrders = state.orders.filter(
          (order) => order.status === filter
        );
      }
    },
    searchOrders: (state, action) => {
      const searchTerm = action.payload.toLowerCase();

      if (!searchTerm) {
        // If search is empty, apply current filter
        if (state.activeFilter === "all") {
          state.filteredOrders = state.orders;
        } else {
          state.filteredOrders = state.orders.filter(
            (order) => order.status === state.activeFilter
          );
        }
        return;
      }

      // Apply search with current filter
      if (state.activeFilter === "all") {
        state.filteredOrders = state.orders.filter(
          (order) =>
            order.id.toString().includes(searchTerm) ||
            order.user_name.toLowerCase().includes(searchTerm) ||
            order.address.toLowerCase().includes(searchTerm) ||
            order.items.some((item) =>
              item.item_name.toLowerCase().includes(searchTerm)
            ) ||
            order.items.some((item) =>
              item.restaurant_name.toLowerCase().includes(searchTerm)
            )
        );
      } else {
        state.filteredOrders = state.orders.filter(
          (order) =>
            order.status === state.activeFilter &&
            (order.id.toString().includes(searchTerm) ||
              order.user_name.toLowerCase().includes(searchTerm) ||
              order.address.toLowerCase().includes(searchTerm) ||
              order.items.some((item) =>
                item.item_name.toLowerCase().includes(searchTerm)
              ) ||
              order.items.some((item) =>
                item.restaurant_name.toLowerCase().includes(searchTerm)
              ))
        );
      }
    },
    sortOrders: (state, action) => {
      const { field, direction } = action.payload;

      state.filteredOrders = [...state.filteredOrders].sort((a, b) => {
        if (field === "date") {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        if (field === "amount") {
          const amountA = parseFloat(a.total_amount);
          const amountB = parseFloat(b.total_amount);
          return direction === "asc" ? amountA - amountB : amountB - amountA;
        }

        if (field === "id") {
          return direction === "asc" ? a.id - b.id : b.id - a.id;
        }

        return 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.filteredOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Не удалось загрузить заказы";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        // Update the order in both arrays
        const updatedOrder = action.payload;

        const orderIndex = state.orders.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = {
            ...state.orders[orderIndex],
            status: updatedOrder.status,
            updated_at: updatedOrder.updated_at,
          };
        }

        const filteredIndex = state.filteredOrders.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (filteredIndex !== -1) {
          // If the filter is not 'all' and the new status doesn't match the filter, remove it
          if (
            state.activeFilter !== "all" &&
            state.activeFilter !== updatedOrder.status
          ) {
            state.filteredOrders = state.filteredOrders.filter(
              (order) => order.id !== updatedOrder.id
            );
          } else {
            state.filteredOrders[filteredIndex] = {
              ...state.filteredOrders[filteredIndex],
              status: updatedOrder.status,
              updated_at: updatedOrder.updated_at,
            };
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Не удалось обновить статус заказа";
      });
  },
});

export const { filterOrders, searchOrders, sortOrders } =
  adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
