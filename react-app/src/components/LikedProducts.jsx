import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import API_URL from "../constants";
import './LikedProducts.css';

function LikedProducts() {
  const [products, setProducts] = useState([]);

  const fetchLikedProducts = () => {
    const userId = localStorage.getItem('userId');
    axios.post(API_URL + '/liked-products', { userId })
      .then(res => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch(() => alert("Server Error"));
  };

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const handleRemove = (productId) => {
    const userId = localStorage.getItem('userId');
    axios.post(API_URL + '/unlike-product', { userId, productId })
      .then(() => {
        setProducts(prev => prev.filter(p => p._id !== productId));
      })
      .catch(() => alert("Remove failed"));
  };

  const moveToCart = (productId) => {
    const userId = localStorage.getItem('userId');
    axios.post(API_URL + '/add-to-cart', { userId, productId })
      .then((res) => {
        if (res.data.message) {
          setProducts(prev => prev.filter(p => p._id !== productId));
          alert("Moved to cart successfully!");
        }
      })
      .catch(() => alert("Add to cart failed"));
  };

  return (
    <>
      <Header />
      <div className="wishlist-wrapper">
        <h2 className="wishlist-title">My Wishlist</h2>
        <div className="wishlist-grid">
          {products.map(item => (
            <div className="wishlist-card" key={item._id}>
              <button className="wishlist-remove" title="Remove from Wishlist" onClick={() => handleRemove(item._id)}>
                <FaTimes />
              </button>

              <img src={API_URL + '/' + item.pimage} alt={item.pname} />
              <div className="wishlist-info">
                <div className="wishlist-name">{item.pname}</div>
                <div className="wishlist-price">
                  Rs.{item.price}
                  {item.oldPrice && (
                    <>
                      <span className="wishlist-old">Rs.{item.oldPrice}</span>
                      <span className="wishlist-discount">
                        ({Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <button onClick={() => moveToCart(item._id)} className="wishlist-move">
                  MOVE TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LikedProducts;
