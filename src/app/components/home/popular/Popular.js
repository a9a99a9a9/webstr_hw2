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
  const movieListRef = useRef(null);
  const currentUserEmail = localStorage.getItem('email');
  const moviesPerPage = 12; // 한 페이지에 보여줄 영화 수

  useEffect(() => {
    fetchMoviesData();
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
          return Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values());
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
      setHasMore(false); // 무한 스크롤 중지
    } else {
      setHasMore(true); // 무한 스크롤 활성화
    }
  };

  const scrollToTop = () => {
    if (movieListRef.current) {
      movieListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const moviesToShow = movies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

  return (
    <div className="popular-container">
      <div className="view-toggle">
        <button onClick={() => handleViewChange('grid')} className={viewType === 'grid' ? 'active' : ''}>
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button onClick={() => handleViewChange('list')} className={viewType === 'list' ? 'active' : ''}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} onAddToWishlist={addToWishlist} />
      )}

      {viewType === 'grid' ? (
        <>
          <div className="movie-grid-container">
            {moviesToShow.map((movie) => (
              <div key={movie.id} className="movie-item" onClick={() => openModal(movie.id)}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>
              이전 페이지
            </button>
            <span>{currentPage}</span>
            <button onClick={loadMoreMovies} disabled={movies.length <= currentPage * moviesPerPage}>
              다음 페이지
            </button>
          </div>
        </>
      ) : (
        <InfiniteScroll
          dataLength={movies.length}
          next={loadMoreMovies}
          hasMore={hasMore}
          loader={<h4>로딩 중...</h4>}
          endMessage={<p>더 이상 영화가 없습니다.</p>}
          scrollableTarget="popular-container"
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
