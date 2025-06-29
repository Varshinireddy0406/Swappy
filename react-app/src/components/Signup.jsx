import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../constants";
import './Signup.css';
//import logo from "../assets/swappy-logo.png'; // use same logo as log

function Signup() {
    const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [mobile, setmobile] = useState('');

  const handleApi = () => {
    const url = API_URL + '/signup';
    const data = { username, password, mobile, email };
    axios.post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert('✅ Signed up successfully!');
           navigate('/'); 
        }
      })
      .catch(() => {
        alert('SERVER ERROR');
      });
  };

  return (
    <div className="signup-page">
      <div className="swappy-logo-text">
  swa<span className="highlight">ppy</span>
</div>

      <div className="signup-card">
        <h2>Sign Up</h2>

        <label>Username</label>
        <input
          type="text"
          className="signup-input"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />

        <label>Mobile</label>
        <input
          type="text"
          className="signup-input"
          value={mobile}
          onChange={(e) => setmobile(e.target.value)}
        />

        <label>Email</label>
        <input
          type="text"
          className="signup-input"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="signup-input"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />

        <button className="signup-btn" onClick={handleApi}>Sign up</button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
