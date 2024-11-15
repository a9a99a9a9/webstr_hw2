// src/app/components/home/wishlist/Wishlist.js

import React, { useState, useEffect } from 'react';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const currentUserEmail = localStorage.getItem('email'); // 현재 로그인된 사용자 이메일 가져오기

  useEffect(() => {
    if (currentUserEmail) {
      // 현재 로그인된 사용자에 맞는 찜 목록 불러오기
      const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUserEmail}`)) || [];
      setWishlist(storedWishlist);
    }
  }, [currentUserEmail]);

  const removeFromWishlist = (id) => {
    // 선택된 영화를 위시리스트에서 제거
    const newWishlist = wishlist.filter((movie) => movie.id !== id);
    setWishlist(newWishlist);
    // 현재 사용자에 맞게 찜 목록을 로컬 스토리지에 저장
    if (currentUserEmail) {
      localStorage.setItem(`wishlist_${currentUserEmail}`, JSON.stringify(newWishlist));
    }
  };

  return (
    <div className="wishlist">
      <h1>내가 찜한 리스트</h1>
      {wishlist.length === 0 ? (
        <p>위시리스트가 비어있습니다.</p> // 위시리스트가 비어 있을 때 메시지
      ) : (
        <div className="wishlist-movies">
          {wishlist.map((movie) => (
            <div key={movie.id} className="wishlist-movie">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="wishlist-movie-info">
                <h2>{movie.title}</h2>
                <button onClick={() => removeFromWishlist(movie.id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
