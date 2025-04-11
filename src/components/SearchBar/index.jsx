import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchAllRestaurants, searchRestaurants } from '../../store/slices/restaurantSlice';
import { clearCategoryFilter } from '../../store/slices/categoriesSlice';
import s from './SearchBar.module.scss';

const SearchBar = ({ selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearch = () => {
    // Clear any category filter when searching
    if (selectedCategory) {
      dispatch(clearCategoryFilter());
    }
    
    if (!searchQuery.trim()) {
      dispatch(fetchAllRestaurants());
      return;
    }
    dispatch(searchRestaurants(searchQuery));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(fetchAllRestaurants());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={s.searchContainer}>
      <div className={s.searchBox}>
        <input
          type="text"
          placeholder="Поиск ресторанов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={s.searchInput}
        />
        {searchQuery && (
          <X size={20} className={s.clearIcon} onClick={handleClearSearch} />
        )}
      </div>
      <button className={s.searchButton} onClick={handleSearch}>
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;