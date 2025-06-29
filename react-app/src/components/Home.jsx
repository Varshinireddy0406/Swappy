import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import './Home.css';
import API_URL from "../constants";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    // Load all products
    axios.get(API_URL + '/get-products')
      .then(res => {
        if (res.data.products) setProducts(res.data.products);
      })
      .catch(() => alert('Failed to load products'));

    if (userId) {
      // Load liked products from backend
      axios.post(API_URL + '/liked-products', { userId })
        .then(res => {
          const likedIds = res.data.products?.map(p => p._id) || [];
          setLikedItems(likedIds);
        })
        .catch(() => console.error('Failed to load liked products'));

      // Load cart items
      axios.post(API_URL + '/get-user-cart', { userId })
        .then(res => {
          const cartIds = res.data?.data?.cart?.map(item => item._id) || [];
          setCartItems(cartIds);
        })
        .catch(() => console.error("Cart load failed"));
    }
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleSearchClick = () => {
    const result = products.filter(item =>
      item.pname.toLowerCase().includes(search.toLowerCase()) ||
      item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setIsSearch(true);
  };

  const handleCategory = (category) => {
    if (category === "All Categories" || category === "All") {
      setIsSearch(false);
    } else {
      const result = products.filter(item => item.category === category);
      setFiltered(result);
      setIsSearch(true);
    }
  };

  const handleLike = (productId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('Please log in first.');

    const isLiked = likedItems.includes(productId);
    const endpoint = API_URL + (isLiked ? '/unlike-product' : '/like-product');

    axios.post(endpoint, { userId, productId })
      .then(() => {
        const updated = isLiked
          ? likedItems.filter(id => id !== productId)
          : [...likedItems, productId];
        setLikedItems(updated);
      })
      .catch(() => alert('Error updating favorite'));
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('Please log in first.');

    axios.post(API_URL + '/add-to-cart', { userId, productId })
      .then(res => {
        if (res.data.code === 200) {
          setCartItems(prev => [...prev, productId]);
        }
      })
      .catch(() => alert('Server Error'));
  };

  const handleProductClick = (id) => {
    navigate('/product/' + id);
  };

  const displayedProducts = isSearch ? filtered : products;

  return (
    <div>
      <Header
        search={search}
        handlesearch={handleSearchChange}
        handleClick={handleSearchClick}
        handleCategory={handleCategory}
      />

      {isSearch && <h5 style={{ marginLeft: "1rem" }}>SEARCH RESULTS</h5>}
      {isSearch && filtered.length === 0 && <h5 style={{ marginLeft: "1rem" }}>No Results Found</h5>}

      <div className="d-flex justify-content-center flex-wrap">
        {displayedProducts.map((item) => (
          <div key={item._id} className="card m-3">
            <div onClick={() => handleProductClick(item._id)}>
              <img width="250px" height="150px" src={API_URL + '/' + item.pimage} alt="product" />
              <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
              <p className="m-2">{item.pname} | {item.category}</p>
              <p className="m-2 text-success">{item.pdesc}</p>
            </div>

            <div onClick={(e) => handleLike(item._id, e)} className="icon-con">
              <FaHeart className={`icons ${likedItems.includes(item._id) ? 'liked' : ''}`} />
            </div>

            <button
              onClick={(e) => handleAddToCart(item._id, e)}
              disabled={cartItems.includes(item._id)}
            >
              {cartItems.includes(item._id) ? 'ADDED ✅' : 'ADD TO CART'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
