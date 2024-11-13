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
  
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (registeredUser && email === registeredUser.email && password === registeredUser.password) {
      setIsAuthenticated(true);
      navigate('/');
    } else {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (registerEmail && registerPassword) {
      localStorage.setItem('registeredUser', JSON.stringify({ email: registerEmail, password: registerPassword }));
      alert('회원가입이 완료되었습니다. 이제 로그인할 수 있습니다.');
      toggleCard();
    } else {
      alert('모든 필드를 입력해 주세요.');
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
              <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <div className="input">
                  <input
                    type="email"
                    id="register-email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Email"
                  />
                  <label htmlFor="register-email">Email</label>
                </div>
                <div className="input">
                  <input
                    type="password"
                    id="register-password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <label htmlFor="register-password">Password</label>
                </div>
                <div className="input">
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <span className="checkbox remember">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms" className="read-text">I have read the Terms and Conditions</label>
                </span>
                <button type="submit">Register</button>
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
