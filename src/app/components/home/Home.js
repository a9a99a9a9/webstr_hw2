// src/app/components/home/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Link 추가
import MovieRow from './MovieRow/MovieRow';
import './Home.css';
import { fetchMovies } from '../../util/api/APIService';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchMovies('popular'),
      fetchMovies('new_releases'),
      fetchMovies('action')
    ])
      .then(([popular, newRelease, action]) => {
        setPopularMovies(popular);
        setNewReleases(newRelease);
        setActionMovies(action);
        setLoading(false);
      })
      .catch((error) => {
        setError('영화를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error(error);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home">
      <MovieRow title="인기 영화" fetchMovies={fetchMovies} />
      <MovieRow title="최신 영화" fetchMovies={fetchMovies} />
      <MovieRow title="액션 영화" fetchMovies={fetchMovies} />
    </div>
  );
}

export default Home;
