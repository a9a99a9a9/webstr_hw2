import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate 추가
import MovieRow from './MovieRow/MovieRow';
import MovieModal from './movie-modal/MovieModal'; // 모달 컴포넌트 추가
import './Home.css';
import { fetchMovies } from '../../util/api/APIService';
import { CSSTransition } from 'react-transition-group'; // 애니메이션을 위한 import

// shuffleArray 함수 정의
const shuffleArray = (array) => {
  const shuffled = [...array]; // 원본 배열을 건드리지 않기 위해 복사
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 두 요소를 교환
  }
  return shuffled;
};

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [new_releasesMovies, setNewReleases] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const navigate = useNavigate(); // navigate 선언
  const currentUserEmail = localStorage.getItem('email'); // 현재 로그인된 사용자 이메일

  useEffect(() => {
    // 로그인 상태 확인
    if (!currentUserEmail) {
      navigate('/signin'); // 로그인 상태가 아니면 /signin으로 리다이렉트
      return;
    }

    setLoading(true);
    setError(null);

    // 영화 데이터를 모두 가져오기
    Promise.all([
      fetchMovies('popular'),
      fetchMovies('new_releases'),
      fetchMovies('action'),
      fetchMovies('drama'),
      fetchMovies('comedy'),
      fetchMovies('horror'),
    ])
      .then(([popular, newRelease, action, drama, comedy, horror]) => {
        setPopularMovies(shuffleArray(popular));
        setNewReleases(shuffleArray(newRelease));
        setActionMovies(shuffleArray(action));
        setDramaMovies(shuffleArray(drama));
        setComedyMovies(shuffleArray(comedy));
        setHorrorMovies(shuffleArray(horror));
        setLoading(false);
      })
      .catch((error) => {
        setError('영화를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error(error);
      });

    // localStorage에서 현재 사용자 찜 목록 불러오기
    const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUserEmail}`)) || [];
    setWishlist(storedWishlist);

    // localStorage에서 현재 사용자 추천 영화 불러오기
    const storedRecommendedMovies = JSON.parse(localStorage.getItem(`recommendedMovies_${currentUserEmail}`)) || [];
    setRecommendedMovies(storedRecommendedMovies);
  }, [currentUserEmail, navigate]); // currentUserEmail과 navigate 의존성 추가

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addToWishlist = () => {
    if (selectedMovie && !wishlist.some((movie) => movie.id === selectedMovie.id)) {
      const newWishlist = [...wishlist, selectedMovie];
      setWishlist(newWishlist);
      localStorage.setItem(`wishlist_${currentUserEmail}`, JSON.stringify(newWishlist)); // 사용자별 찜 목록을 localStorage에 저장
      closeModal();
    }
  };

  const toggleRecommendedMovie = (movie) => {
    let updatedRecommendedMovies = [...recommendedMovies];
    const index = updatedRecommendedMovies.findIndex((m) => m.id === movie.id);

    if (index > -1) {
      // 이미 추천된 영화가 있다면 삭제
      updatedRecommendedMovies.splice(index, 1);
    } else {
      // 추천 목록에 추가
      updatedRecommendedMovies.push(movie);
    }

    setRecommendedMovies(updatedRecommendedMovies);
    localStorage.setItem(`recommendedMovies_${currentUserEmail}`, JSON.stringify(updatedRecommendedMovies)); // 사용자별 추천 영화 저장
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

      {/* 추천 영화 섹션 */}
      <div className="recommended-movies">
        <h2>추천 영화</h2>
        <div className="movie-row-container">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="movie-poster" onClick={() => toggleRecommendedMovie(movie)}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 영화 목록 렌더링 */}
      {['popular', 'new_releases', 'action', 'drama', 'comedy', 'horror'].map((category) => (
        <div key={category} className="movie-row">
          <h2>{category === 'popular' ? '인기 영화' : category === 'new_releases' ? '최신 영화' : category === 'action' ? '액션 영화' : category === 'drama' ? '드라마 영화' : category === 'comedy' ? '코미디 영화' : '공포 영화'}</h2>
          <div className="movie-row-container">
            <MovieRow 
              movies={eval(`${category}Movies`)} // 동적으로 각 영화 상태 사용
              fetchMovies={(page) => fetchMovies(category, page)} 
              onPosterClick={openModal} 
              onPosterClickRecommended={toggleRecommendedMovie}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
