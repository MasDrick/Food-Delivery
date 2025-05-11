import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
// Import the message handling function
import { showMessage } from "../features/messages/messageActions";

// Base URL for API requests
const API_URL = `${API_BASE_URL}/api`;

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Show success message if it exists in the response
      if (response.data.message) {
        dispatch(showMessage(response.data.message, "success"));
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      
      // Show error message
      const errorMessage = error.response?.data?.message || "Failed to fetch users";
      dispatch(showMessage(errorMessage, "error"));
      
      return rejectWithValue(errorMessage);
    }
  }
);

// In updateUser thunk
export const updateUser = createAsyncThunk(
  "adminUsers/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/admin/users/${userData.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Возвращаем успешный результат с сообщением
      return {
        ...response.data,
        message: response.data.message || "Пользователь успешно обновлен",
        type: "success"
      };
    } catch (error) {
      console.error("Error updating user:", error);
      
      // Возвращаем ошибку с сообщением
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update user",
        type: "error"
      });
    }
  }
);

// In deleteUser thunk
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Возвращаем успешный результат с сообщением
      return {
        userId,
        message: response.data.message || "Пользователь успешно удален",
        type: "success"
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      
      // Возвращаем ошибку с сообщением
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete user",
        type: "error"
      });
    }
  }
);

// In makeAdmin thunk
export const makeAdmin = createAsyncThunk(
  "adminUsers/makeAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/admin/users/${userId}/make-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Возвращаем успешный результат с сообщением
      return {
        ...response.data.user,
        message: response.data.message || "Пользователь успешно назначен администратором",
        type: "success"
      };
    } catch (error) {
      console.error("Error making user admin:", error);
      
      // Возвращаем ошибку с сообщением
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to make user admin",
        type: "error"
      });
    }
  }
);

// In addUser thunk
export const addUser = createAsyncThunk(
  'adminUsers/addUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/admin/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Show success message
      if (response.data.message) {
        dispatch(showMessage(response.data.message, "success"));
      } else {
        dispatch(showMessage("Пользователь успешно добавлен", "success"));
      }
      
      return response.data;
    } catch (error) {
      // Show error message
      const errorMessage = error.response?.data?.message || 'Не удалось добавить пользователя';
      dispatch(showMessage(errorMessage, "error"));
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Начальное состояние
const initialState = {
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  activeFilter: 'all',
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  addUserLoading: false,
  addUserError: null,
};

// Создание slice
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    filterUsers: (state, action) => {
      const filter = action.payload;
      state.activeFilter = filter;

      if (filter === "all") {
        state.filteredUsers = state.users;
      } else {
        state.filteredUsers = state.users.filter(
          (user) => user.role === filter
        );
      }
    },
    searchUsers: (state, action) => {
      const searchTerm = action.payload.toLowerCase();

      if (!searchTerm) {
        // If search is empty, apply current filter
        if (state.activeFilter === "all") {
          state.filteredUsers = state.users;
        } else {
          state.filteredUsers = state.users.filter(
            (user) => user.role === state.activeFilter
          );
        }
        return;
      }

      // Apply search with current filter
      if (state.activeFilter === "all") {
        state.filteredUsers = state.users.filter(
          (user) =>
            (user.email && user.email.toLowerCase().includes(searchTerm)) ||
            (user.username && user.username.toLowerCase().includes(searchTerm)) ||
            (user.phone && user.phone.includes(searchTerm))
        );
      } else {
        state.filteredUsers = state.users.filter(
          (user) =>
            user.role === state.activeFilter &&
            ((user.email && user.email.toLowerCase().includes(searchTerm)) ||
            (user.username && user.username.toLowerCase().includes(searchTerm)) ||
            (user.phone && user.phone.includes(searchTerm)))
        );
      }
    },
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.deleteError = null;
      state.addUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users reducers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
    
        // Apply current filter if it's not 'all'
        if (state.activeFilter !== "all") {
          state.filteredUsers = state.users.filter(
            (user) => user.role === state.activeFilter
          );
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Не удалось загрузить пользователей";
      })
      
      // Update user reducers
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
    
        // Update user in the users array
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
    
        // Update filtered users as well
        const filteredIndex = state.filteredUsers.findIndex(user => user.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredUsers[filteredIndex] = action.payload;
        }
        
        // Re-apply filter
        if (state.activeFilter !== "all") {
          state.filteredUsers = state.users.filter(
            (user) => user.role === state.activeFilter
          );
        }
        
        // Показываем сообщение об успехе
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            showMessage(action.payload.message, action.payload.type);
          }, 0);
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload?.message || "Не удалось обновить пользователя";
        
        // Показываем сообщение об ошибке
        if (typeof window !== 'undefined' && action.payload) {
          setTimeout(() => {
            showMessage(action.payload.message, action.payload.type);
          }, 0);
        }
      })
      
      // Delete user reducers
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
    
        // Remove user from the users array
        state.users = state.users.filter(user => user.id !== action.payload.userId);
    
        // Remove from filtered users as well
        state.filteredUsers = state.filteredUsers.filter(user => user.id !== action.payload.userId);
        
        // Показываем сообщение об успехе
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            showMessage(action.payload.message, action.payload.type);
          }, 0);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload?.message || "Не удалось удалить пользователя";
        
        // Показываем сообщение об ошибке
        if (typeof window !== 'undefined' && action.payload) {
          setTimeout(() => {
            showMessage(action.payload.message, action.payload.type);
          }, 0);
        }
      })
      
      // Make admin reducers
      .addCase(makeAdmin.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(makeAdmin.fulfilled, (state, action) => {
        state.updateLoading = false;
    
        // Update user role in the users array
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index].role = 'admin';
        }
    
        // Update filtered users as well
        const filteredIndex = state.filteredUsers.findIndex(user => user.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredUsers[filteredIndex].role = 'admin';
        }
        
        // Re-apply filter
        if (state.activeFilter !== "all") {
          state.filteredUsers = state.users.filter(
            (user) => user.role === state.activeFilter
          );
        }
        
        // Показываем сообщение об успехе
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            showMessage(action.payload.message, action.payload.type);
          }, 0);
        }
      })
      .addCase(makeAdmin.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload?.message || "Не удалось назначить пользователя администратором";
        
        // Показываем сообщение об ошибке
        if (typeof window !== 'undefined' && action.payload) {
          setTimeout(() => {
            showMessage(action.payload.message, action.payload.type);
          }, 0);
        }
      })
      
      // Добавление пользователя
      .addCase(addUser.pending, (state) => {
        state.addUserLoading = true;
        state.addUserError = null;
      })
      // В extraReducers для addUser.fulfilled
      .addCase(addUser.fulfilled, (state, action) => {
        state.addUserLoading = false;
        // НЕ добавляем пользователя в state здесь
        // Вместо этого мы полностью обновим список через fetchUsers
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addUserLoading = false;
        state.addUserError = action.payload;
      });
  }
});

export const { filterUsers, searchUsers, clearErrors } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
