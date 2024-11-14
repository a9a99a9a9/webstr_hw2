import React, { useState, useEffect } from 'react';
import MovieRow from './MovieRow/MovieRow';
import MovieModal from './movie-modal/MovieModal'; // 모달 컴포넌트 추가
import './Home.css';
import { fetchMovies } from '../../util/api/APIService';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]); // 드라마 영화 상태 추가
  const [comedyMovies, setComedyMovies] = useState([]); // 코미디 영화 상태 추가
  const [horrorMovies, setHorrorMovies] = useState([]); // 공포 영화 상태 추가
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
        setPopularMovies(shuffleArray(popular)); // 랜덤 정렬 적용
        setNewReleases(shuffleArray(newRelease)); // 랜덤 정렬 적용
        setActionMovies(shuffleArray(action)); // 랜덤 정렬 적용
        setDramaMovies(shuffleArray(drama)); // 랜덤 정렬 적용
        setComedyMovies(shuffleArray(comedy)); // 랜덤 정렬 적용
        setHorrorMovies(shuffleArray(horror)); // 랜덤 정렬 적용
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
      {isModalOpen && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onAddToWishlist={addToWishlist}
        />
      )}
      {/* 각 카테고리별로 개별 스크롤 적용 */}
      <div className="movie-row">
        <h2>인기 영화</h2>
        <div className="movie-row-container">
          <MovieRow 
            movies={popularMovies || []} 
            fetchMovies={(page) => fetchMovies('popular', page)} 
            onPosterClick={openModal} 
          />
        </div>
      </div>

      <div className="movie-row">
        <h2>최신 영화</h2>
        <div className="movie-row-container">
          <MovieRow 
            movies={newReleases || []} 
            fetchMovies={(page) => fetchMovies('new_releases', page)} 
            onPosterClick={openModal} 
          />
        </div>
      </div>

      <div className="movie-row">
        <h2>액션 영화</h2>
        <div className="movie-row-container">
          <MovieRow 
            movies={actionMovies || []} 
            fetchMovies={(page) => fetchMovies('action', page)} 
            onPosterClick={openModal} 
          />
        </div>
      </div>

      <div className="movie-row">
        <h2>드라마 영화</h2>
        <div className="movie-row-container">
          <MovieRow 
            movies={dramaMovies || []} 
            fetchMovies={(page) => fetchMovies('drama', page)} 
            onPosterClick={openModal} 
          />
        </div>
      </div>

      <div className="movie-row">
        <h2>코미디 영화</h2>
        <div className="movie-row-container">
          <MovieRow 
            movies={comedyMovies || []} 
            fetchMovies={(page) => fetchMovies('comedy', page)} 
            onPosterClick={openModal} 
          />
        </div>
      </div>

      <div className="movie-row">
        <h2>공포 영화</h2>
        <div className="movie-row-container">
          <MovieRow 
            movies={horrorMovies || []} 
            fetchMovies={(page) => fetchMovies('horror', page)} 
            onPosterClick={openModal} 
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
