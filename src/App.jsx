import React from 'react';
import Header from './components/Header/';
import s from './app.module.scss';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import restaurantsData from './FakeData/RestarauntData.json';

function App() {
  return (
    <div className={s.wrapper}>
      <Header />
      <Routes>
        <Route path="/" element={<Home restaurantsData={restaurantsData} />} />
        <Route path="/restaurant/:id" element={<Restaurants restaurants={restaurantsData} />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}

export default App;
