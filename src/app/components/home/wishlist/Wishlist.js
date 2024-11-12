// src/app/components/home/wishlist/Wishlist.js

import React, { useState, useEffect } from 'react';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // localStorage에서 찜 목록 불러오기
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter((movie) => movie.id !== id);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist)); // localStorage에 저장
  };

  return (
    <div className="wishlist">
      <h1>내가 찜한 리스트</h1>
      {wishlist.length === 0 ? (
        <p>찜한 영화가 없습니다.</p>
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