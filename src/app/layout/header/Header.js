import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faBars, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ setIsAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null); // 사용자 이메일 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // localStorage에서 찜 목록 불러오기
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistCount(storedWishlist.length);

    // 로그인된 이메일 가져오기
    const email = localStorage.getItem('email');
    setUserEmail(email); // 이메일 상태 설정
  }, [setIsAuthenticated]);

  const removeKey = () => {
    // localStorage에서 로그인 정보 및 찜 리스트 삭제
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('wishlist');
    
    // 인증 상태를 false로 설정
    setIsAuthenticated(false);

    // 페이지 리디렉션 (로그인 페이지로 이동)
    navigate('/signin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!userEmail) {
    return null; // 로그인되지 않은 경우 헤더를 표시하지 않음
  }

  return (
    <div id="container">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <FontAwesomeIcon icon={faTicketAlt} style={{ color: '#E50914' }} />
            </Link>
          </div>
          <nav className="nav-links desktop-nav">
            <ul>
              <li><Link to="/">홈</Link></li>
              <li><Link to="/popular">대세 콘텐츠</Link></li>
              <li><Link to="/wishlist">내가 찜한 리스트 ({wishlistCount})</Link></li>
              <li><Link to="/search">찾아보기</Link></li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          {userEmail && ( // 로그인 상태일 때 이메일과 로그아웃 버튼 표시
            <>
              <span>{userEmail}</span> 
              <button className="icon-button" onClick={removeKey}>
                <FontAwesomeIcon icon={faSignOutAlt} /> 로그아웃
              </button>
            </>
          )}
          <button className="icon-button mobile-menu-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <nav>
          <ul>
            <li><Link to="/" onClick={toggleMobileMenu}>홈</Link></li>
            <li><Link to="/popular" onClick={toggleMobileMenu}>대세 콘텐츠</Link></li>
            <li><Link to="/wishlist" onClick={toggleMobileMenu}>내가 찜한 리스트 ({wishlistCount})</Link></li>
            <li><Link to="/search" onClick={toggleMobileMenu}>찾아보기</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
