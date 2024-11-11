import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../../layout/header/Header'; // Header 컴포넌트

const Home: React.FC = () => {
  return (
    <div id="app">
      <Header />
      <div id="container">
        <Routes>
          {/* 라우트 설정을 여기에 추가 */}
        </Routes>
      </div>
    </div>
  );
};

export default Home;
