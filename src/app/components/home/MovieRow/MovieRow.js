import React, { useState, useEffect } from 'react';

function MovieRow({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]); // 빈 배열로 초기화

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        setMovies(data.results || []); // 데이터를 정상적으로 가져오면 movies 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMovies([]); // 오류 발생 시 빈 배열로 초기화
      }
    };

    fetchMovies();
  }, [fetchUrl]);

  // movies가 없거나 빈 배열일 때는 "Loading..." 메시지 출력
  if (!movies || movies.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-row">
      <h2>{title}</h2>
      <div className="movie-row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className="movie-row__poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.name}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieRow;
