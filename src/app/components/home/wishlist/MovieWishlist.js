import React, { useState } from 'react';
import './Wishlist.css'; // CSS 파일은 필요시 추가

const MovieWishlist = () => {
  // 예시로 좋아하는 영화 목록을 관리하는 상태
  const [wishlist, setWishlist] = useState([]);

  // 영화 추가 함수
  const addMovieToWishlist = (movie) => {
    setWishlist([...wishlist, movie]);
  };

  // 영화 삭제 함수
  const removeMovieFromWishlist = (movieId) => {
    setWishlist(wishlist.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <div className="movie-list">
        {wishlist.length > 0 ? (
          wishlist.map((movie) => (
            <div key={movie.id} className="movie-item">
              <h3>{movie.title}</h3>
              <button onClick={() => removeMovieFromWishlist(movie.id)}>
                Remove from Wishlist
              </button>
            </div>
          ))
        ) : (
          <p>No movies in your wishlist.</p>
        )}
      </div>

      {/* 예시로 영화 추가 버튼을 넣음 */}
      <button onClick={() => addMovieToWishlist({ id: Date.now(), title: 'New Movie' })}>
        Add a Movie to Wishlist
      </button>
    </div>
  );
};

export default MovieWishlist;
