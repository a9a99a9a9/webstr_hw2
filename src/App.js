import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './app/components/home/Home';
import Header from './app/layout/header/Header';
import SignIn from './app/components/signin/SignIn'; // SignIn 컴포넌트 임포트
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 로그인 상태 관리
  useEffect(() => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {
      setIsAuthenticated(true);
    }
  }, []); // 처음 한 번만 실행

  return (
    <Router>
      <Header />
      <Routes>
        {/* 로그인 상태에 따라 페이지 이동 */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
        
        {/* 로그인되지 않은 경우 /signin으로 이동 */}
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/" /> : <SignIn setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}

export default App;
