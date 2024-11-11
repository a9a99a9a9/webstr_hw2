import React from 'react';
import './MovieRow.css';

function MovieRow({ title, movies }) {
  // movies가 undefined일 경우 빈 배열로 처리
  const movieList = movies || [];

  return (
    <div className="movie-row">
      <h2>{title}</h2>
      <div className="movie-row__posters">
        {movieList.length === 0 ? (
          <p>Loading...</p> // 데이터가 없으면 'Loading...' 표시
        ) : (
          movieList.map((movie) => (
            <img
              key={movie.id}
              className="movie-row__poster"
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MovieRow;
