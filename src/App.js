// src/app/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './app/components/home/Home';
import MovieDetail from './app/components/movie-detail/MovieDetail';  // MovieDetail 추가
import Header from './app/layout/header/Header';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />  {/* 영화 상세 페이지 경로 */}
      </Routes>
    </Router>
  );
}

export default App;
