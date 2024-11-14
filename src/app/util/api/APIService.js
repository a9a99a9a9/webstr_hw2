export const fetchMovies = async (category) => {
  const API_KEY = '7bd1ba614e1eca467c9c659df3f40e8b'; // API 키
  const baseUrl = 'https://api.themoviedb.org/3';
  let url = '';

  // 각 카테고리에 맞는 URL 설정
  switch (category) {
    case 'popular':
      url = `${baseUrl}/movie/popular?api_key=${API_KEY}`;
      break;
    case 'new_releases':
      url = `${baseUrl}/movie/now_playing?api_key=${API_KEY}`; // 최신 영화 목록 엔드포인트
      break;
    case 'action':
      url = `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=28`; // 액션 영화 장르 ID는 28
      break;
    case 'drama':
      url = `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=18`; // 드라마 영화 장르 ID는 18
      break;
    case 'comedy':
      url = `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=35`; // 코미디 영화 장르 ID는 35
      break;
    case 'horror':
      url = `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=27`; // 공포 영화 장르 ID는 27
      break;
    default:
      url = `${baseUrl}/movie/popular?api_key=${API_KEY}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  return data.results; // 영화 목록 반환
};

export const fetchMovieDetails = async (movieId) => {
  const API_KEY = '7bd1ba614e1eca467c9c659df3f40e8b'; // API 키
  const baseUrl = 'https://api.themoviedb.org/3';
  
  // 영화의 상세 정보 가져오기
  const movieDetailsUrl = `${baseUrl}/movie/${movieId}?api_key=${API_KEY}`;
  const responseDetails = await fetch(movieDetailsUrl);
  const movieDetails = await responseDetails.json();

  // 예고편 정보 가져오기
  const videoUrl = `${baseUrl}/movie/${movieId}/videos?api_key=${API_KEY}`;
  const responseVideos = await fetch(videoUrl);
  const videoData = await responseVideos.json();

  // 예고편 정보 중 첫 번째 것을 반환
  const trailer = videoData.results.find(video => video.type === 'Trailer');

  return { ...movieDetails, trailer }; // 상세 정보와 예고편을 함께 반환
};
