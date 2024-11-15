import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Home from './app/components/home/Home';
import Header from './app/layout/header/Header';
import SignIn from './app/components/signin/SignIn';
import Wishlist from './app/components/home/wishlist/Wishlist';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    setIsAuthenticated(!!email);
  }, []);

  return (
    <Router>
      {isAuthenticated && (
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      )}
      <TransitionGroup>
        <CSSTransition timeout={300} classNames="fade" unmountOnExit>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" replace />} />
            <Route path="/signin" element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/wishlist" element={isAuthenticated ? <Wishlist /> : <Navigate to="/signin" replace />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </Router>
  );
}

export default App;
