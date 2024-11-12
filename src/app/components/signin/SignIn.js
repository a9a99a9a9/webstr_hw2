import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate로 변경
import './SignIn.css'; // CSS 파일 임포트

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // useNavigate로 리디렉션 처리

  // 이메일 형식 검사
  const validateEmail = (email) => emailRegex.test(email);

  // 로그인 함수
  const handleLogin = () => {
    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    // TMDB API 호출 (비밀번호 검증)
    fetch('https://api.themoviedb.org/3/authentication/token/new?api_key=YOUR_API_KEY')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password); // 암호화 고려 필요
          navigate('/'); // 로그인 성공 후 홈 페이지로 리디렉션
        } else {
          setErrorMessage('Invalid credentials');
        }
      });
  };

  // 회원가입 함수
  const handleSignUp = () => {
    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must agree to the terms');
      return;
    }

    // 회원가입 로직 (여기서는 로그인 창으로 이동)
    alert('Sign Up Successful!');
    navigate('/signin'); // 회원가입 후 로그인 페이지로 이동
  };

  return (
    <div className="container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isSignUp && (
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        {isSignUp && (
          <div>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <span>I agree to the terms and conditions</span>
          </div>
        )}
        {!isSignUp && (
          <div>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span>Remember Me</span>
          </div>
        )}
        <button onClick={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
