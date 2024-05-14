import express from 'express';
import { initConnection } from './db/connection.js';
import ErrorHandeler from './helper/error-handeler.js';
import UserRoutes from './src/modules/user/user.routes.js';
import CategoryRoutes from './src/modules/category/category.routes.js';
import ProductRoutes from './src/modules/product/product.routes.js';
import CouponRoutes from './src/modules/coupon/coupon.routes.js';
import CartRoutes from './src/modules/cart/cart.routes.js';
import OrderRoutes from './src/modules/order/order.routes.js';


const app = express()
const port = 3300 ;
initConnection();
app.use(express.json());

//all module routes

app.use(UserRoutes);
app.use(CategoryRoutes);
app.use(ProductRoutes);
app.use(CouponRoutes);
app.use(CartRoutes);
app.use(OrderRoutes)

//error handling
// app.use(ErrorHandeler);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))