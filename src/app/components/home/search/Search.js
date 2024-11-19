import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieModal from '../movie-modal/MovieModal';
import './Search.css';
import { fetchMovies } from '../../../util/api/APIService'; // 수정된 fetchMovies import

const Search = () => {
  const [genreId, setGenreId] = useState('28'); // 기본 장르
  const [ageId, setAgeId] = useState(-1); // 기본 평점
  const [sortId, setSortId] = useState('popularity.desc'); // 기본 정렬
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMoviesData(); // 초기 영화 데이터 로드
  }, [genreId, ageId, sortId, page]);

  const fetchMoviesData = async () => {
    try {
      const data = await fetchMovies('discover', {
        genreId,
        sortBy: sortId,
        voteAverage: ageId,
        page,
      });
      if (data.length > 0) {
        setMovies((prevMovies) => [...prevMovies, ...data]);
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
      setGenreId(value);
    } else if (name === 'age') {
      setAgeId(value);
    } else if (name === 'sort') {
      setSortId(value);
    }
    setPage(1); // 페이지와 영화 목록 초기화
    setMovies([]);
  };

  return (
    <div className="search-container">
      <h1>영화 검색</h1>
      <div className="search-filters">
        {/* 필터 적용 */}
        <select name="genre" onChange={handleSearchChange}>
          <option value="28">Action</option>
          <option value="12">Adventure</option>
          <option value="35">Comedy</option>
        </select>
        <select name="age" onChange={handleSearchChange}>
          <option value="-1">평점 전체</option>
          <option value="9">9~10</option>
          <option value="8">8~9</option>
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
            <div key={movie.id} className="movie-item">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Search;