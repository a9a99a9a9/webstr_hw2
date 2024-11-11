// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './app/components/home/Home';
import SignIn from './app/components/sign-in/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="signin" element={<SignIn />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
