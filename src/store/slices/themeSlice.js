import { createSlice } from '@reduxjs/toolkit';

// Check if user has a theme preference stored
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

// Apply initial theme to document
document.documentElement.setAttribute('data-theme', initialTheme);

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: initialTheme
  },
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      state.currentTheme = newTheme;
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      // Apply to document
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;