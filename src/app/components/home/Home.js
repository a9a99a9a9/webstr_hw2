// src/app/components/home/Home.js
import React, { useState, useEffect } from 'react';
import MovieRow from './MovieRow/MovieRow';
import MovieModal from './movie-modal/MovieModal'; // 모달 컴포넌트 추가
import './Home.css';
import { fetchMovies } from '../../util/api/APIService';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [wishlist, setWishlist] = useState([]); // 찜 목록 상태

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

  const openModal = (movie) => {
    setSelectedMovie(movie); // 선택된 영화 정보 저장
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const addToWishlist = () => {
    setWishlist([...wishlist, selectedMovie]); // 찜 목록에 영화 추가
    closeModal(); // 찜 후 모달 닫기
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home">
      {isModalOpen && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onAddToWishlist={addToWishlist}
        />
      )}
      {/* MovieRow 컴포넌트에 영화 데이터 전달 */}
      <MovieRow title="인기 영화" fetchMovies={fetchMovies} movies={popularMovies} onPosterClick={openModal} />
      <MovieRow title="최신 영화" fetchMovies={fetchMovies} movies={newReleases} onPosterClick={openModal} />
      <MovieRow title="액션 영화" fetchMovies={fetchMovies} movies={actionMovies} onPosterClick={openModal} />
    </div>
  );
}

export default Home;
