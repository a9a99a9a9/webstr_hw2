// src/app/components/home/Home.js
import React from 'react';
import Header from '../../layout/header/Header';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div id="app">
      <Header /> {/* 헤더 컴포넌트 */}
      <div id="container">
        <Outlet /> {/* 하위 컴포넌트를 렌더링 */}
      </div>
    </div>
  );
};

export default Home;
