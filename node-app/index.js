require('dotenv').config(); 

const express = require('express')
const cors = require('cors')
const path = require('path');
var jwt = require('jsonwebtoken');
const multer = require('multer')
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const paymentController = require('./controllers/paymentController');
const orderController = require('./controllers/orderController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })
const bodyParser = require('body-parser')
const app = express()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const port = process.env.PORT || 4000;

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.send('hello...')
})

app.get('/search', productController.search)
app.post('/like-product', userController.likeProduct)
app.post('/add-product', upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productController.addProduct)
app.post('/edit-product', upload.fields([{ name: 'pimage' }, { name: 'pimage2' }]), productController.editProduct)
app.get('/get-products', productController.getProducts)
app.post('/delete-product', productController.deleteProduct)
app.get('/get-product/:pId', productController.getProductsById)

app.post('/liked-products', userController.likedProducts)
app.post('/unlike-product', userController.unlikeProduct);
app.post('/my-products', productController.myProducts)
app.post('/signup', userController.signup)
app.get('/my-profile/:userId', userController.myProfileById)
app.get('/get-user/:uId', userController.getUserById)
app.post('/get-user', userController.getUser);  

app.post('/login', userController.login)
app.post('/add-to-cart', userController.addToCart)
app.post('/get-user-cart', userController.getCart)
app.post('/remove-from-cart', userController.removeFromCart);
app.post('/create-order', paymentController.createOrder);
app.post('/verify-payment', paymentController.verifyPayment);
//app.post('/my-orders', paymentController.getUserOrders);
app.post('/get-my-orders', orderController.getOrdersByUser);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
