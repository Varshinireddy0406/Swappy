const Orders = require('../models/Order');

module.exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await Orders.find({ userId }).sort({ createdAt: -1 });
    res.send({ success: true, orders });
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).send({ success: false });
  }
};
