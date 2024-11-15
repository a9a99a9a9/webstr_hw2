import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieModal from '../movie-modal/MovieModal';
import './Popular.css';
import { fetchMovies } from '../../../util/api/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState('grid');

  const currentUserEmail = localStorage.getItem('email');
  const moviesPerPage = 10; // 페이지당 표시할 영화 수

  useEffect(() => {
    setLoading(true);
    setError(null);

    // 초기 영화 데이터 로드
    fetchMovies('popular', currentPage)
      .then((fetchedMovies) => {
        setMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
        setLoading(false);
      })
      .catch((error) => {
        setError('영화를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error(error);
      });
  }, [currentPage]);

  const fetchMoreData = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewChange = (view) => {
    setViewType(view);
    if (view === 'grid') {
      document.querySelector('.popular-container').style.overflow = 'hidden';
    } else {
      document.querySelector('.popular-container').style.overflow = 'auto';
    }
  };

  const handlePagination = (direction) => {
    if (direction === 'next') {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 테이블 뷰일 때 현재 페이지에 맞는 영화 목록만 가져오기
  const paginatedMovies = movies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

  if (loading && currentPage === 1) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="popular-container">
      <div className="view-toggle">
        <button
          onClick={() => handleViewChange('grid')}
          className={viewType === 'grid' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button
          onClick={() => handleViewChange('list')}
          className={viewType === 'list' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      {viewType === 'list' ? (
        <InfiniteScroll
          dataLength={movies.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>로딩 중...</h4>}
          endMessage={<p>더 이상 영화가 없습니다.</p>}
        >
          <div className="movie-list-container">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-item" onClick={() => openModal(movie)}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="movie-grid-container">
          {paginatedMovies.map((movie) => (
            <div key={movie.id} className="movie-item" onClick={() => openModal(movie)}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      )}

      {viewType === 'grid' && (
        <div className="pagination">
          <button onClick={() => handlePagination('prev')} disabled={currentPage === 1}>
            이전 페이지
          </button>
          <span>현재 페이지: {currentPage}</span>
          <button onClick={() => handlePagination('next')}>
            다음 페이지
          </button>
        </div>
      )}

      {viewType === 'list' && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} /> 맨 위로
        </button>
      )}
    </div>
  );
};

export default Popular;
