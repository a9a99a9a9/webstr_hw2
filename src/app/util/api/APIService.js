// src/util/api/APIService.js

const API_KEY = '7bd1ba614e1eca467c9c659df3f40e8b';  // API 키
const API_URL = 'https://api.themoviedb.org/3';  // API 기본 URL

// 영화 목록을 가져오는 함수
export const fetchMovies = async (category = 'popular') => {
  try {
    const response = await fetch(`${API_URL}/movie/${category}?api_key=${API_KEY}&language=ko-KR`);
    const data = await response.json();
    return data.results; // 영화 데이터 반환
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
