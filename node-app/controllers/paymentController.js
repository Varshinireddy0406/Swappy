const Razorpay = require("razorpay");
const crypto = require("crypto");
const Orders = require("../models/Order"); // ✅ make sure this file exists

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
module.exports.createOrder = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `swappy_rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.send({ success: true, order });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).send({ success: false });
  }
};

// ✅ Verify Razorpay Signature & Save Order
module.exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cartItems,
    userId
  } = req.body;

  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    return res.status(400).send({ success: false, message: "Invalid signature" });
  }

  // ✅ Store verified order in DB
  const orderRecord = new Orders({
    userId,
    razorpay_order_id,
    razorpay_payment_id,
    items: cartItems,
    createdAt: new Date()
  });

  try {
    await orderRecord.save();
    return res.send({ success: true });
  } catch (err) {
    console.error("❌ Order save error:", err);
    return res.status(500).send({ success: false, message: "Failed to store order" });
  }
};
