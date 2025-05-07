import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
  },
  reducers: {
    showNotification: (state, action) => {
      const { message, type = 'info' } = action.payload;
      state.notifications.push({
        id: Date.now(),
        message,
        type,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { showNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;