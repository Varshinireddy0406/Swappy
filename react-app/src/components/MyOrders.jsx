import { useEffect, useState } from "react";
import Header from "./Header";
import API_URL from "../constants";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.post(`${API_URL}/get-my-orders`, { userId });
        if (res.data?.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("❌ Order fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Header />
      <div className="orders-wrapper">
        <h2 className="orders-title">My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => {
            const total = order.items.reduce((sum, item) => sum + parseInt(item.price), 0);
            return (
              <div key={index} className="order-card">
                <div className="order-header">
                  <span><strong>Order ID:</strong> {order.razorpay_order_id}</span>
                  <span><strong>Payment ID:</strong> {order.razorpay_payment_id}</span>
                </div>
                <ul className="order-items">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.pname} – ₹{item.price}</li>
                  ))}
                </ul>
                <div className="order-footer">
                  <span><strong>Total:</strong> ₹{total}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyOrders;
