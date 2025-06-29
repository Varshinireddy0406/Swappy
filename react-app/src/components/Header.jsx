import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch, FaShoppingCart, FaPlus, FaUserCircle } from "react-icons/fa";
import { useState } from 'react';

function Header(props) {
  const [showOver, setShowOver] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const categories = [
    "All Categories", "Mattresses", "Quilts and covers", "Dustbin", "Foot-mats",
    "Bathing products", "Books", "Electronics", "Broomstick and Dustpan", "Bed"
  ];

  return (
    <>
      {/* Main Header */}
      <div className="header-bar">
        <Link to="/" className="logo-text">
          swa<span className="highlight">ppy</span>
        </Link>

        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={props?.search}
            onChange={(e) => props?.handlesearch?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") props?.handleClick?.();
            }}
          />
        </div>

        <div className="actions-area">
          <div className="icon-btn" onClick={() => setShowOver(!showOver)}>
            <FaUserCircle size={22} />
            <span>Login</span>
          </div>

          <Link to="/user-cart" className="icon-btn">
            <FaShoppingCart size={20} />
            <span>Cart</span>
          </Link>

          <Link to="/add-product" className="icon-btn">
            <FaPlus size={18} />
            <span>Sell</span>
          </Link>

          {showOver && (
            <div className="dropdown-box">
              {!!localStorage.getItem('token') && (
                <>
                  <Link to="/my-profile"><button>Profile</button></Link>
                  <Link to="/liked-products"><button>Favourites</button></Link>
                  <Link to="/my-products"><button>My Products</button></Link>
                  <Link to="/my-orders"><button>My Orders</button></Link>

                </>
              )}
              <div>
                {!localStorage.getItem('token') ? (
                  <Link to="/login"><button>Login</button></Link>
                ) : (
                  <button onClick={handleLogout}>Logout</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Bar */}
     <div className="category-strip">
  {[
    "All Categories", "Mattresses", "Quilts and covers", "Dustbin",
    "Foot-mats", "Bathing products", "Books", "Electronics",
    "Broomstick and Dustpan", "Bed"
  ].map((cat, i) => (
    <button key={i} onClick={() => props?.handleCategory?.(cat)}>
      {cat}
    </button>
  ))}
</div>

    </>
  );
}

export default Header;
