import 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import errorHandler from './middleware/errorHandler.js';
import categoryRouter from './router/categoryRouter.js';
import orderRouter from './router/orderRouter.js';
import serviceRouter from './router/ourServiceRouter.js';
import productRouter from './router/productRouter.js';
import authRouter from './router/userAuth.js';
//dotenv config
dotenv.config();

// Port
const PORT = process.env.PORT || 9090;

//init express
const app = express();
app.use(cookieParser());

//static folder
app.use(express.static('public'));

//middleware support
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:9000',
    credentials: true,
  })
);
//Router
app.use(authRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(orderRouter);
app.use(serviceRouter);

//errorHandler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is runnig on port ${PORT}`.bgGreen.black);
});
