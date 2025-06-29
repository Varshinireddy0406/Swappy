const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Users = mongoose.model('Users', {
  username: String,
  mobile: String,
  email: String,
  password: String,
  likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

// 🔐 Signup
module.exports.signup = async (req, res) => {
  const { username, password, email, mobile } = req.body;
  try {
    const user = new Users({ username, password, email, mobile });
    await user.save();
    res.send({ message: 'Signup successful.' });
  } catch {
    res.status(500).send({ message: 'Server error during signup.' });
  }
};

// 🔐 Login
module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    if (!user) return res.send({ message: 'User not found.' });
    if (user.password !== password) return res.send({ message: 'Incorrect password.' });

    const token = jwt.sign({ data: user }, 'MYKEY', { expiresIn: '1h' });
    res.send({ message: 'Login successful.', token, userId: user._id });
  } catch {
    res.status(500).send({ message: 'Server error during login.' });
  }
};

// 👤 Get Profile by ID
module.exports.myProfileById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({
      message: 'success',
      user: { username: user.username, email: user.email, mobile: user.mobile }
    });
  } catch {
    res.status(500).send({ message: 'Server error fetching profile' });
  }
};

// 👤 Get User (POST)
// module.exports.getUserById = async (req, res) => {
//   try {
//     const user = await Users.findById(req.body.id);
//     if (!user) return res.status(404).send({ message: 'User not found' });
//     res.send({ message: 'success', user });
//   } catch {
//     res.status(500).send({ message: 'Server error fetching user' });
//   }
// };

module.exports.getUserById = (req, res) => {
    const _userId = req.params.uId;
    Users.findOne({ _id: _userId })
        .then((result) => {
            res.send({
                message: 'success.', user: {
                    email: result.email,
                    mobile: result.mobile,
                    username: result.username
                }
            })
        })
        .catch(() => {
            res.send({ message: 'server err' })
        })
}

module.exports.getUser = (req, res) => {
  const userId = req.body.id;

  if (!userId) {
    return res.status(400).send({ message: "User ID missing" });
  }

  Users.findById(userId)
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      res.send({ message: "success", user });
    })
    .catch((err) => {
      console.error("❌ Error fetching user:", err);
      res.status(500).send({ message: "server err" });
    });
};



// ❤️ Like a product
module.exports.likeProduct = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } });
    res.send({ message: 'Product liked successfully' });
  } catch {
    res.status(500).send({ message: 'Server error while liking' });
  }
};

// 💔 Unlike a product
module.exports.unlikeProduct = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await Users.updateOne({ _id: userId }, { $pull: { likedProducts: productId } });
    res.send({ message: 'Product unliked successfully' });
  } catch {
    res.status(500).send({ message: 'Server error while unliking' });
  }
};

// ⭐ Get all liked products
module.exports.likedProducts = async (req, res) => {
  try {
    const user = await Users.findById(req.body.userId).populate('likedProducts');
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({ message: 'success', products: user.likedProducts });
  } catch {
    res.status(500).send({ message: 'Server error fetching liked products' });
  }
};

// 🛒 Add to cart
module.exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await Users.updateOne({ _id: userId }, { $addToSet: { cart: productId } });
    res.send({ message: 'Added to cart successfully.' });
  } catch {
    res.status(500).send({ message: 'Server error adding to cart.' });
  }
};

// 🛒 Get cart
module.exports.getCart = async (req, res) => {
  try {
    const user = await Users.findById(req.body.userId).populate('cart');
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({ code: 200, message: 'Get cart success.', data: user });
  } catch {
    res.status(500).send({ message: 'Server error fetching cart.' });
  }
};

// 🗑️ Remove from cart
module.exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const result = await Users.updateOne({ _id: userId }, { $pull: { cart: productId } });
    if (result.modifiedCount > 0) {
      res.send({ message: 'Removed from cart' });
    } else {
      res.send({ message: 'Item not found in cart' });
    }
  } catch {
    res.status(500).send({ message: 'Server error removing from cart' });
  }
};
