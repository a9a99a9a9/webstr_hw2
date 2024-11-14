import React, { useState, useEffect } from 'react';
import MovieRow from './MovieRow/MovieRow';
import MovieModal from './movie-modal/MovieModal'; // 모달 컴포넌트 추가
import './Home.css';
import { fetchMovies } from '../../util/api/APIService';
import { CSSTransition } from 'react-transition-group'; // 애니메이션을 위한 import

function Home() {
  const [movies, setMovies] = useState({
    popular: [],
    new_releases: [],
    action: [],
    drama: [],
    comedy: [],
    horror: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [wishlist, setWishlist] = useState([]); // 찜 목록 상태

  // 랜덤 정렬 함수 (Fisher-Yates 알고리즘)
  const shuffleArray = (array) => {
    const shuffled = [...array]; // 원본 배열을 건드리지 않기 위해 복사
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 두 요소를 교환
    }
    return shuffled;
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // 영화 데이터를 모두 가져오기
    Promise.all([
      fetchMovies('popular'),
      fetchMovies('new_releases'),
      fetchMovies('action'),
      fetchMovies('drama'), // 드라마 영화 데이터 추가
      fetchMovies('comedy'), // 코미디 영화 데이터 추가
      fetchMovies('horror'), // 공포 영화 데이터 추가
    ])
      .then(([popular, newRelease, action, drama, comedy, horror]) => {
        setMovies({
          popular: shuffleArray(popular),
          new_releases: shuffleArray(newRelease),
          action: shuffleArray(action),
          drama: shuffleArray(drama),
          comedy: shuffleArray(comedy),
          horror: shuffleArray(horror),
        });
        setLoading(false);
      })
      .catch((error) => {
        setError('영화를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error(error);
      });

    // localStorage에서 찜 목록 불러오기
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const openModal = (movie) => {
    setSelectedMovie(movie); // 선택된 영화 정보 저장
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const addToWishlist = () => {
    if (selectedMovie && !wishlist.some((movie) => movie.id === selectedMovie.id)) {
      const newWishlist = [...wishlist, selectedMovie];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist)); // 찜 목록을 localStorage에 저장
      closeModal(); // 찜 후 모달 닫기
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home">
      <CSSTransition
        in={isModalOpen}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onAddToWishlist={addToWishlist}
        />
      </CSSTransition>

      {/* 각 카테고리별로 개별 스크롤 적용 */}
      {Object.keys(movies).map((category) => (
        <div key={category} className="movie-row">
          <h2>{category === 'popular' ? '인기 영화' : category === 'new_releases' ? '최신 영화' : category === 'action' ? '액션 영화' : category === 'drama' ? '드라마 영화' : category === 'comedy' ? '코미디 영화' : '공포 영화'}</h2>
          <div className="movie-row-container">
            <MovieRow 
              movies={movies[category] || []} 
              fetchMovies={(page) => fetchMovies(category, page)} 
              onPosterClick={openModal} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
