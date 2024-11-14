import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './app/components/home/Home';
import Header from './app/layout/header/Header';
import SignIn from './app/components/signin/SignIn';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 로그인 상태 관리
  useEffect(() => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // 초기 로드 시 한번만 실행되도록 설정

  // 로그아웃 처리 함수 (로그아웃 시 인증 상태 초기화)
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    setIsAuthenticated(false); // 인증 상태 변경
  };

  return (
    <Router>
      <Header setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} /> {/* 로그아웃 함수 전달 */}
      <Routes>
        {/* 로그인 상태에 따라 렌더링 */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/" /> : <SignIn setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}

export default App;
