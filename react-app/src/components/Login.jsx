import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API_URL from "../constants";
import './Login.css'; // 👈 Import the CSS

function Login() {
  const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');

 const handleApi = () => {
  const url = API_URL + '/login';
  const data = { username, password };

  axios.post(url, data)
    .then((res) => {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        navigate('/');
      } else {
        alert(res.data.message); // Shows "Incorrect password" or "User not found"
      }
    })
    .catch(() => {
      alert('SERVER ERROR');
    });
};


  return (
    
    <div className="login-wrapper">
      <div className="login-card">
         <div className="swappy-logo-text">
  swa<span className="highlight">ppy</span>
</div>


        <h2>Login</h2>

        <label>Username</label>
        <input
          type="text"
          className="login-input"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleApi}>Log in</button>

        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
