import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieModal from '../movie-modal/MovieModal';
import './Popular.css';
import { fetchMovies, fetchMovieDetails } from '../../../util/api/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState('grid');
  const [wishlist, setWishlist] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const currentUserEmail = localStorage.getItem('email'); // 현재 사용자 이메일

  const containerRef = useRef(null);
  const movieListRef = useRef(null);

  useEffect(() => {
    fetchMoviesData(); // 영화 데이터 로드

    // 로컬 스토리지에서 찜한 영화와 추천 영화 불러오기
    const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUserEmail}`)) || [];
    const storedRecommendedMovies = JSON.parse(localStorage.getItem(`recommendedMovies_${currentUserEmail}`)) || [];
    setWishlist(storedWishlist);
    setRecommendedMovies(storedRecommendedMovies);
  }, [currentUserEmail, currentPage]);

  const fetchMoviesData = async () => {
    try {
      const data = await fetchMovies('popular', { page: currentPage });

      if (data.length > 0) {
        setMovies((prevMovies) => {
          const allMovies = [...prevMovies, ...data];
          const uniqueMovies = Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values());
          return uniqueMovies;
        });
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('영화 데이터 로드 실패:', error);
    }
  };

  const loadMoreMovies = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const openModal = async (movieId) => {
    try {
      const movieDetails = await fetchMovieDetails(movieId);
      setSelectedMovie(movieDetails);

      // 추천 영화에 자동 등록
      if (!recommendedMovies.some((m) => m.id === movieId)) {
        const updatedRecommended = [...recommendedMovies, movieDetails];
        setRecommendedMovies(updatedRecommended);
        localStorage.setItem(`recommendedMovies_${currentUserEmail}`, JSON.stringify(updatedRecommended));
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('영화 상세 정보 로드 실패:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const addToWishlist = () => {
    if (selectedMovie && !wishlist.some((movie) => movie.id === selectedMovie.id)) {
      const newWishlist = [...wishlist, selectedMovie];
      setWishlist(newWishlist);
      localStorage.setItem(`wishlist_${currentUserEmail}`, JSON.stringify(newWishlist));
      closeModal();
    }
  };

  const handleViewChange = (view) => {
    setViewType(view);
    if (view === 'grid') {
      containerRef.current.style.overflow = 'hidden';
    } else {
      containerRef.current.style.overflow = 'auto';
    }
  };

  const scrollToTop = () => {
    if (movieListRef.current) {
      movieListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="popular-container">
      <div className="view-toggle" style={{ marginTop: '80px' }}>
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
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onAddToWishlist={addToWishlist}
        />
      )}

      {viewType === 'list' ? (
        <InfiniteScroll
          dataLength={movies.length}
          next={loadMoreMovies}
          hasMore={hasMore}
          loader={<h4>로딩 중...</h4>}
          endMessage={<p>더 이상 영화가 없습니다.</p>}
        >
          <div ref={movieListRef} className="movie-list-container">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-item" onClick={() => openModal(movie.id)}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="movie-grid-container">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-item" onClick={() => openModal(movie.id)}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      )}

      {viewType === 'list' && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          style={{ display: movies.length > 0 ? 'block' : 'none' }}
        >
          <FontAwesomeIcon icon={faArrowUp} /> 맨 위로
        </button>
      )}
    </div>
  );
};

export default Popular;
