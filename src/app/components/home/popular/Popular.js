import React, { useState, useEffect } from "react";
import MovieGrid from "../movieGrid/MovieGrid";
import MovieInfiniteScroll from "../movieInfiniteScroll/MovieInfiniteScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faBars } from "@fortawesome/free-solid-svg-icons";
import { getPopularMoviesURL } from "../../../util/movie/URL";

const Popular = () => {
  const [currentView, setCurrentView] = useState("grid");
  const [apiKey, setApiKey] = useState(localStorage.getItem("TMDb-Key") || "");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const setView = (view) => {
    setCurrentView(view);
    if (view === "grid") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const fetchURL = () => {
    return getPopularMoviesURL(apiKey);
  };

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
        <MovieGrid title="인기 영화" fetchUrl={fetchURL()} />
      )}

      {currentView === "list" && (
        <MovieInfiniteScroll
          apiKey={apiKey}
          genreCode="28"
          sortingOrder="all"
          voteEverage="-1"
        />
      )}
    </div>
  );
};

export default Popular;
