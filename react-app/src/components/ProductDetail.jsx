import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import API_URL from "../constants";
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const url = API_URL + '/get-product/' + productId;
    axios.get(url)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
        }
      })
      .catch(() => alert('Server Error'));
  }, [productId]);

  const handleContact = (addedBy) => {
    const url = API_URL + '/get-user/' + addedBy;
    axios.get(url)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          setShowContact(true);
        }
      })
      .catch(() => alert('Server Error'));
  };

  return (
    <>
      <Header />
      <div className="product-detail-container">
        <h2 className="title">PRODUCT DETAILS</h2>

        {product && (
          <div className="product-detail-content">
            {/* Images in a row */}
            <div className="product-images-row">
              <img src={API_URL + '/' + product.pimage} alt="Main" />
              {product.pimage2 && (
                <img src={API_URL + '/' + product.pimage2} alt="Second" />
              )}
            </div>

            {/* Info and contact */}
            <div className="product-info">
              <h3>Rs. {product.price} /-</h3>
              <p>{product.pname} | {product.category}</p>
              <p className="text-success">{product.pdesc}</p>

              <h4>Product Description:</h4>
              <p>{product.pdesc}</p>

              {showContact && user ? (
                <div className="contact-box">
                  <h4>{user.username}</h4>
                  <p>{user.mobile}</p>
                  <p>{user.email}</p>
                </div>
              ) : (
                product.addedBy && (
                  <button onClick={() => handleContact(product.addedBy)}>
                    SHOW CONTACT DETAILS
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
