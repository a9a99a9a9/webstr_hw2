// src/app/components/home/Home.js
import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../../util/api/APIService'; // APIService에서 fetchMovies 가져오기

function Home() {
  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    // 영화 데이터를 가져오는 비동기 함수
    const getMovies = async () => {
      const movieData = await fetchMovies('popular'); // 인기 영화 데이터를 가져오기
      setMovies(movieData);
    };
    
    getMovies();
  }, []);

  return (
    <div className="home">
      <h1>Popular Movies</h1>
      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map(movie => (
            <div key={movie.id} className="movie-item">
              <h2>{movie.title}</h2>
              <p>{movie.overview}</p>
              {/* 영화 포스터 미리보기 */}
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              )}
            </div>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
