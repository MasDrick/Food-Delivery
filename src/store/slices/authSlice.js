import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { showMessage } from "../features/messages/messageActions";
import { clearCart } from "./cartSlice";

// Base URL for API requests
const API_URL = `${API_BASE_URL}/auth`;

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Return message with the response data
      return {
        ...response.data,
        messageInfo: {
          text: response.data.message || "Вы успешно вошли в систему",
          type: "success",
        },
      };
    } catch (error) {
      // Return error message
      const errorMessage =
        error.response?.data?.message || "Ошибка при входе в систему";

      if (error.response && error.response.data) {
        return rejectWithValue({
          ...error.response.data,
          messageInfo: {
            text: errorMessage,
            type: "error",
          },
        });
      } else {
        return rejectWithValue({
          message: error.message,
          messageInfo: {
            text: errorMessage,
            type: "error",
          },
        });
      }
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Sending registration data:", userData);
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Return message with the response data
      return {
        ...response.data,
        messageInfo: {
          text: response.data.message || "Регистрация прошла успешно",
          type: "success",
        },
      };
    } catch (error) {
      console.error(
        "Registration error details:",
        error.response?.data || error.message
      );

      // Return error message
      const errorMessage =
        error.response?.data?.message || "Ошибка при регистрации";

      if (error.response && error.response.data) {
        return rejectWithValue({
          ...error.response.data,
          messageInfo: {
            text: errorMessage,
            type: "error",
          },
        });
      } else {
        return rejectWithValue({
          message: error.message,
          messageInfo: {
            text: errorMessage,
            type: "error",
          },
        });
      }
    }
  }
);

// Async thunk for checking authentication status
export const checkAuthStatus = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      const response = await axios.get(`${API_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue({ isAuthenticated: false, user: null });
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    // Добавьте dispatch в параметры
    try {
      const token = localStorage.getItem("token");
      let logoutMessage = "Вы вышли из системы";

      if (token) {
        try {
          const response = await axios.post(
            `${API_URL}/logout`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data && response.data.message) {
            logoutMessage = response.data.message;
          }
        } catch (error) {
          console.log("Logout API error:", error);
        }
      }

      // Очищаем localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("cartState");

      // Диспатчим экшен для очистки корзины в Redux
      dispatch(clearCart());

      return { success: true, message: logoutMessage };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("cartState");
      return { success: true, message: "Вы вышли из системы" };
    }
  }
);

// Make sure your token is being stored correctly in the auth state
const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;

        // Show success message
        if (action.payload.messageInfo) {
          setTimeout(() => {
            showMessage(
              action.payload.messageInfo.text,
              action.payload.messageInfo.type
            );
          }, 0);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        // Show error message
        if (action.payload?.messageInfo) {
          setTimeout(() => {
            showMessage(
              action.payload.messageInfo.text,
              action.payload.messageInfo.type
            );
          }, 0);
        }
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;

        // Show success message
        if (action.payload.messageInfo) {
          setTimeout(() => {
            showMessage(
              action.payload.messageInfo.text,
              action.payload.messageInfo.type
            );
          }, 0);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        // Show error message
        if (action.payload?.messageInfo) {
          setTimeout(() => {
            showMessage(
              action.payload.messageInfo.text,
              action.payload.messageInfo.type
            );
          }, 0);
        }
      })

      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.error = null;

        // Используем импортированную функцию showMessage вместо require
        if (typeof window !== "undefined") {
          setTimeout(() => {
            showMessage(action.payload.message, "info");
          }, 0);
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if the API call fails, we still want to log out locally
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isLoading = false;

        // Используем импортированную функцию showMessage вместо require
        if (typeof window !== "undefined") {
          setTimeout(() => {
            showMessage("Вы вышли из системы", "info");
          }, 0);
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
