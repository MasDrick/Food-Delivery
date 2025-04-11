import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme } from '../../store/slices/themeSlice';
import s from './themeToggle.module.scss';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button 
      className={s.themeToggleButton} 
      onClick={handleThemeToggle}
      aria-label={currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;