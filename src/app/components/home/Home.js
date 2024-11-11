import React, { useState, useEffect } from 'react';
import MovieRow from './MovieRow/MovieRow';
import './Home.css';
import { fetchMovies } from '../../util/api/APIService';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  useEffect(() => {
    fetchMovies('popular').then(data => setPopularMovies(data));
    fetchMovies('new_releases').then(data => setNewReleases(data));
    fetchMovies('action').then(data => setActionMovies(data));
  }, []);

  return (
    <div className="home">
      <MovieRow title="인기 영화" movies={popularMovies} />
      <MovieRow title="최신 영화" movies={newReleases} />
      <MovieRow title="액션 영화" movies={actionMovies} />
    </div>
  );
}

export default Home;
