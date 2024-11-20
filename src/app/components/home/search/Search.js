import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieModal from '../movie-modal/MovieModal'; // 모달 컴포넌트 import
import './Search.css';
import { fetchMovies, fetchMovieDetails } from '../../../util/api/APIService'; // fetchMovieDetails 추가

const Search = () => {
  const [genreId, setGenreId] = useState(''); // 기본 장르 전체
  const [minVote, setMinVote] = useState(0); // 기본 최소 평점
  const [maxVote, setMaxVote] = useState(10); // 기본 최대 평점
  const [sortId, setSortId] = useState('popularity.desc'); // 기본 정렬
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화 정보 저장
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMoviesData(); // 초기 영화 데이터 로드
  }, [genreId, minVote, maxVote, sortId, page]);

  const fetchMoviesData = async () => {
    try {
      const data = await fetchMovies('discover', {
        genreId,
        sortBy: sortId,
        minVote,
        maxVote,
        page,
      });

      if (data.length > 0) {
        setMovies((prevMovies) => {
          const allMovies = [...prevMovies, ...data];
          const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
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
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    if (name === 'genre') {
      setGenreId(value === '0' ? '' : value); // '장르 (전체)' 선택 시 빈 값 설정
    } else if (name === 'age') {
      switch (value) {
        case '9':
          setMinVote(9);
          setMaxVote(10);
          break;
        case '8':
          setMinVote(8);
          setMaxVote(9);
          break;
        case '7':
          setMinVote(7);
          setMaxVote(8);
          break;
        case '6':
          setMinVote(6);
          setMaxVote(7);
          break;
        case '5':
          setMinVote(5);
          setMaxVote(6);
          break;
        case '4':
          setMinVote(4);
          setMaxVote(5);
          break;
        case '0':
          setMinVote(0);
          setMaxVote(4);
          break;
        default:
          setMinVote(0); // 평점 전체
          setMaxVote(10);
          break;
      }
    } else if (name === 'sort') {
      setSortId(value);
    }
    setPage(1); // 페이지와 영화 목록 초기화
    setMovies([]);
  };

  const openModal = async (movieId) => {
    try {
      const movieDetails = await fetchMovieDetails(movieId); // 영화 상세 정보 가져오기
      setSelectedMovie(movieDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('영화 상세 정보 로드 실패:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="search-container">
      <h1>영화 검색</h1>
      <div className="search-filters">
        <select name="genre" onChange={handleSearchChange}>
          <option value="0">장르 (전체)</option>
          <option value="28">액션</option>
          <option value="12">모험</option>
          <option value="16">애니메이션</option>
          <option value="35">코미디</option>
          <option value="80">범죄</option>
          <option value="99">다큐멘터리</option>
          <option value="18">드라마</option>
          <option value="10751">가족</option>
          <option value="14">판타지</option>
          <option value="36">역사</option>
          <option value="27">공포</option>
          <option value="10402">음악</option>
          <option value="9648">미스터리</option>
          <option value="10749">로맨스</option>
          <option value="878">SF</option>
          <option value="10770">TV 영화</option>
          <option value="53">스릴러</option>
          <option value="10752">전쟁</option>
          <option value="37">서부극</option>
        </select>

        <select name="age" onChange={handleSearchChange}>
          <option value="10">평점 (전체)</option>
          <option value="9">9~10</option>
          <option value="8">8~9</option>
          <option value="7">7~8</option>
          <option value="6">6~7</option>
          <option value="5">5~6</option>
          <option value="4">4~5</option>
          <option value="0">4점 이하</option>
        </select>

        <select name="sort" onChange={handleSearchChange}>
          <option value="popularity.desc">인기순</option>
          <option value="vote_average.desc">평점순</option>
          <option value="release_date.desc">최신순</option>
        </select>
      </div>

      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={<h4>로딩 중...</h4>}
        endMessage={<p>더 이상 영화가 없습니다.</p>}
      >
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-item" onClick={() => openModal(movie.id)}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
};

export default Search;
