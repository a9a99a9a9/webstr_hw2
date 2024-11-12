// src/app/components/movie-detail/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // URL 파라미터 사용
import { fetchMovieDetails } from '../../util/api/APIService'; // 영화 상세 정보 API

const MovieDetail = () => {
  const { movieId } = useParams();  // URL에서 영화 ID 가져오기
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(movieId);  // 영화 상세 데이터 가져오기
        setMovie(movieData);
        setIsLoading(false);
      } catch (err) {
        setError('영화 정보를 불러오는 데 실패했습니다.');
        setIsLoading(false);
      }
    };

    getMovieDetails();
  }, [movieId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={movie.title}
      />
      {/* 찜하기 버튼 추가 */}
      <button>찜하기</button>
    </div>
  );
};

export default MovieDetail;
