import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import API_URL from "../constants";
import { FaUserCircle } from "react-icons/fa";
import "./MyProfile.css";

function MyProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .post(`${API_URL}/get-user`, { id: userId })
      .then((res) => {
        console.log("✅ User response:", res.data);
        if (res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.error("❌ Profile fetch error:", err);
        alert("Server Error");
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-avatar">
            <FaUserCircle size={70} />
            <h3>User Profile</h3>
          </div>
          <div className="profile-row">
            <label>Username</label>
            <span>{user.username || "-"}</span>
          </div>
          <div className="profile-row">
            <label>Email ID</label>
            <span>{user.email || "-"}</span>
          </div>
          <div className="profile-row">
            <label>Mobile Number</label>
            <span>{user.mobile || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
