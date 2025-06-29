import { useEffect, useState } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import axios from "axios";
import './MyProducts.css';
import API_URL from "../constants";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const url = API_URL + '/my-products';
    const data = { userId: localStorage.getItem('userId') };
    axios.post(url, data)
      .then((res) => {
        if (res.data.products) setProducts(res.data.products);
      })
      .catch(() => alert('Server Error'));
  }, [refresh]);

  const handleDel = (pid) => {
    axios.post(API_URL + '/delete-product', {
      pid,
      userId: localStorage.getItem('userId')
    })
      .then((res) => {
        if (res.data.message) {
          alert("Deleted successfully");
          setRefresh(!refresh);
        }
      })
      .catch(() => alert("Server Error"));
  };

  return (
    <>
      <Header />
      
      <div className="myproducts-container">
        <h2 className="myproducts-title">My Products</h2>

        <div className="myproducts-table-header">
          <div className="my-col product-col">Product</div>
          <div className="my-col cat-col">Category</div>
          <div className="my-col price-col">Price</div>
          <div className="my-col action-col">Actions</div>
        </div>

        {products.map((item) => (
          <div className="myproducts-row" key={item._id}>
            <div className="my-col product-col">
              <div className="my-product-info">
                <img src={API_URL + '/' + item.pimage} alt={item.pname} className="my-product-img" />
                <div>
                  <div className="my-product-name">{item.pname}</div>
                  <div className="my-product-desc">{item.pdesc}</div>
                </div>
              </div>
            </div>
            <div className="my-col cat-col">{item.category}</div>
            <div className="my-col price-col">Rs. {item.price}</div>
            <div className="my-col action-col">
              <Link to={`/edit-product/${item._id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button className="delete-btn" onClick={() => handleDel(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyProducts;
