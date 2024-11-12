import React, { useState, useEffect } from "react";
import { fetchMovies } from "../../../util/api/APIService"; // fetchMovies import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faBars } from "@fortawesome/free-solid-svg-icons";
import './Popular.css';  // 스타일 시트가 있다면 import
import MovieRow from "../MovieRow/MovieRow";  // MovieRow import

const Popular = () => {
  const [currentView, setCurrentView] = useState("grid");
  const [popularMovies, setPopularMovies] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem("TMDb-Key") || "");
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가
  const [error, setError] = useState(null);  // 에러 상태 추가

  useEffect(() => {
    // fetchMovies 함수 호출
    if (apiKey) {
      fetchMovies('popular', apiKey) // 'popular' 카테고리의 영화를 가져옵니다.
        .then((movies) => {
          setPopularMovies(movies);
          setLoading(false);  // 로딩 완료
        })
        .catch((error) => {
          console.error("Error fetching popular movies:", error);
          setError(error);  // 에러 상태 업데이트
          setLoading(false);  // 로딩 완료
        });
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [apiKey]);  // apiKey가 변경될 때마다 호출

  const setView = (view) => {
    setCurrentView(view);
    if (view === "grid") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // 로딩 중일 때 화면 표시
  }

  if (error) {
    return <div>Error loading movies: {error.message}</div>;  // 에러 발생 시 화면 표시
  }

  return (
    <div className="popular-container">
      <div className="view-toggle">
        <button
          onClick={() => setView("grid")}
          className={currentView === "grid" ? "active" : ""}
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button
          onClick={() => setView("list")}
          className={currentView === "list" ? "active" : ""}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {currentView === "grid" && (
        <MovieRow title="인기 영화" movies={popularMovies} />
      )}

      {currentView === "list" && (
        <MovieRow title="인기 영화" movies={popularMovies} />
      )}
    </div>
  );
};

export default Popular;
