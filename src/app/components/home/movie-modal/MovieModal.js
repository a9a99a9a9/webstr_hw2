// src/app/components/movie-modal/MovieModal.js
import React from 'react';
import './MovieModal.css'; // 스타일 파일 추가

function MovieModal({ movie, onClose, onAddToWishlist }) {
  if (!movie) return null;

  return (
    <div className="movie-modal">
      <div className="movie-modal__content">
        <span className="movie-modal__close" onClick={onClose}>
          &times;
        </span>
        <div className="movie-modal__image">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
        <div className="movie-modal__details">
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <button onClick={onAddToWishlist}>찜하기</button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
