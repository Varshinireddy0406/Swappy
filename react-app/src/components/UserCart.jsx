import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import API_URL from "../constants";
import './UserCart.css';

function UserCart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const url = API_URL + '/get-user-cart';
    const data = { userId: localStorage.getItem('userId') };
    axios.post(url, data)
      .then((res) => {
        setData(res.data.data.cart);
      })
      .catch(() => {
        alert('Server Error');
      });
  };

  // const handleRemove = (productId) => {
  //   const url = API_URL + '/remove-from-cart';
  //   const dataToSend = {
  //     userId: localStorage.getItem('userId'),
  //     productId: productId
  //   };

  //   axios.post(url, dataToSend)
  //     .then((res) => {
  //       if (res.data.message === "Removed") {
  //         fetchCart(); // Refresh cart
  //       }
  //     })
  //     .catch(() => {
  //       alert('Remove failed');
  //     });
  // };
  const handleRemove = async (productId) => {
  try {
    const res = await axios.post(API_URL + '/remove-from-cart', {
      userId: localStorage.getItem('userId'),
      productId
    });

    if (res.data.success === true || res.data.message?.toLowerCase() === "removed") {
      setData(prev => prev.filter(item => item._id !== productId));
    } else {
      alert(res.data.message || "Could not remove item.");
    }
  } catch (err) {
    alert("Remove failed");
    console.error("❌ Frontend Remove Error:", err);
  }
};

  const handleCheckout = async () => {
  const amount = data.reduce((sum, i) => sum + parseInt(i.price), 0);
  const { order } = (await axios.post(`${API_URL}/create-order`, { amount })).data;

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Swappy",
    description: "Cart Payment",
    order_id: order.id,
    // handler: async (response) => {
    //   alert(`Payment successful: ${response.razorpay_payment_id}`);
    //   // TODO: verify payment & store order server‑side
    // },
    handler: async function (response) {
  alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);

  try {
    const verifyRes = await axios.post(`${API_URL}/verify-payment`, {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      cartItems: data, // Optional: send purchased products
      userId: localStorage.getItem("userId")
    });

    if (verifyRes.data.success) {
      alert("🎉 Payment Verified & Order Stored!");
    } else {
      alert("⚠️ Payment verification failed.");
    }
  } catch (err) {
    alert("❌ Server Error during verification.");
    console.error(err);
  }
},

     method: {
        upi: true,       // ✅ Show UPI (with QR Code inside)
        card: true,
        netbanking: true
      },
    prefill: { name: "User", email: "user@example.com" },
    theme: { color: "#3399cc" }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  return (
    <div>
      <Header />

      <div className="cart-container">
        <h2 className="cart-heading">Shopping Cart</h2>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 && data.map((item) => (
              <tr key={item._id}>
                <td className="product-info">
                  <img
                    src={API_URL + '/' + item.pimage}
                    alt={item.pname}
                    className="product-img"
                  />
                  <div>
                    <div className="product-name">{item.pname}</div>
                    <div className="product-desc">{item.pdesc}</div>
                  </div>
                </td>
                <td>Rs. {item.price}</td>
                <td>Rs. {item.price}</td>
                <td>
                  <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length > 0 && (
          <div className="cart-footer">
            <span className="subtotal-label">Subtotal</span>
            <span className="subtotal-value">
              Rs. {data.reduce((total, item) => total + parseInt(item.price), 0)}
            </span>
          </div>
        )}

        {data.length > 0 && (
          <div className="checkout-btn-container">
            <button className="checkout-btn" onClick={handleCheckout}>Continue to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCart;
