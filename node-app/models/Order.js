const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  items: [Object], // stores your cart items
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Orders", orderSchema);
