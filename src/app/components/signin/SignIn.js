import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 성공 처리
    if (email && password) {
      // 로그인 성공 시 localStorage에 정보 저장
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);

      // 상태를 업데이트하여 인증 처리
      setIsAuthenticated(true);
      
      // home 페이지로 이동
      navigate('/');
    }
  };

  const focusInput = (field) => {
    if (field === 'email') setIsEmailFocused(true);
    if (field === 'password') setIsPasswordFocused(true);
  };

  const blurInput = (field) => {
    if (field === 'email') setIsEmailFocused(false);
    if (field === 'password') setIsPasswordFocused(false);
  };

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            {/* 로그인 화면 */}
            <div className={`card ${isLoginVisible ? '' : 'hidden'}`} id="login">
              <form onSubmit={handleLogin}>
                <h1>Sign in</h1>
                <div className={`input ${isEmailFocused || email ? 'active' : ''}`}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => focusInput('email')}
                    onBlur={() => blurInput('email')}
                  />
                  <label htmlFor="email">Username or Email</label>
                </div>
                <div className={`input ${isPasswordFocused || password ? 'active' : ''}`}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => focusInput('password')}
                    onBlur={() => blurInput('password')}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember" className="read-text">Remember me</label>
                </span>
                <span className="checkbox forgot">
                  <a href="#">Forgot Password?</a>
                </span>
                <button type="submit" disabled={!email || !password}>Login</button>
              </form>
              <a href="javascript:void(0)" className="account-check" onClick={toggleCard}>
                Don't have an account? <b>Sign up</b>
              </a>
            </div>

            {/* 회원가입 화면 */}
            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form>
                <h1>Sign up</h1>
                <div className="input">
                  <input type="email" id="register-email" placeholder="Email" />
                  <label htmlFor="register-email">Email</label>
                </div>
                <div className="input">
                  <input type="password" id="register-password" placeholder="Password" />
                  <label htmlFor="register-password">Password</label>
                </div>
                <div className="input">
                  <input type="password" id="confirm-password" placeholder="Confirm Password" />
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <span className="checkbox remember">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms" className="read-text">I have read the Terms and Conditions</label>
                </span>
                <button>Register</button>
              </form>
              <a href="javascript:void(0)" className="account-check" onClick={toggleCard}>
                Already have an account? <b>Sign in</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
