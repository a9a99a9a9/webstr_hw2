import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieModal from '../movie-modal/MovieModal';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUserEmail = localStorage.getItem('email'); // 현재 로그인된 사용자 이메일

  useEffect(() => {
    // localStorage에서 현재 사용자 찜 목록 불러오기
    const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUserEmail}`)) || [];
    setWishlist(storedWishlist);
  }, [currentUserEmail]);

  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter((movie) => movie.id !== id);
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${currentUserEmail}`, JSON.stringify(newWishlist)); // 사용자별 찜 목록을 localStorage에 저장
  };

  const fetchMoreData = () => {
    if (wishlist.length >= 50) {
      setHasMore(false);
      return;
    }
    // 더 많은 데이터를 불러오는 로직 (데모를 위해 임의로 설정)
    setTimeout(() => {
      setWishlist((prevWishlist) => [...prevWishlist, ...prevWishlist.slice(0, 10)]);
    }, 1500);
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="wishlist-container">
      <h1>내가 찜한 리스트</h1>
      {wishlist.length === 0 ? (
        <p>위시리스트가 비어있습니다.</p>
      ) : (
        <InfiniteScroll
          dataLength={wishlist.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>로딩 중...</h4>}
          endMessage={<p>더 이상 영화가 없습니다.</p>}
        >
          <div className="wishlist-movies">
            {wishlist.map((movie) => (
              <div key={movie.id} className="wishlist-movie" onClick={() => openModal(movie)}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="wishlist-movie-info">
                  <h2>{movie.title}</h2>
                  <button onClick={(e) => { e.stopPropagation(); removeFromWishlist(movie.id); }}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
};

export default Wishlist;
