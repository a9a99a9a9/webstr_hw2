// src/app/components/home/MovieRow/MovieRow.js
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; // Link 추가
import './MovieRow.css';

function MovieRow({ title, fetchMovies }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const newMovies = await fetchMovies(page);  // fetchMovies를 props로 받아서 사용
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setLoading(false);
    };

    loadMovies();
  }, [page, fetchMovies]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="movie-row" onScroll={handleScroll}>
      <h2>{title}</h2>
      <div className="movie-row__posters">
        {movies.length === 0 ? (
          <p>Loading...</p>
        ) : (
          movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-row__link">
              <img
                className="movie-row__poster"
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
              />
            </Link>
          ))
        )}
      </div>
      {loading && <p>Loading more movies...</p>}
    </div>
  );
}

export default MovieRow;
