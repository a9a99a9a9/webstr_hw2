import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './app/components/home/Home';
import Header from './app/layout/header/Header';
import SignIn from './app/components/signin/SignIn'; // SignIn 컴포넌트 임포트
import './App.css';

function App() {
  // 로그인 상태 확인
  const isAuthenticated = localStorage.getItem('email') && localStorage.getItem('password');

  return (
    <Router>
      <Header />
      <Routes>
        {/* 로그인 상태 확인 후, 메인 페이지로 이동 */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
        
        {/* 로그인 되지 않은 사용자는 /signin 페이지로 이동 */}
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/" /> : <SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
