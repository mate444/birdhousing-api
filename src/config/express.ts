import cors from 'cors';
import express from 'express';
import birdhouseRouter from '../birdhouse/controllers/birdhouse.controller';
import userRouter from '../user/controllers/user.controller';
import orderRouter from '../order/controllers/order.controller';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const createServer = (): express.Application => {
  const app = express();
  const morganMiddleware = process.env.NODE_ENV === 'production' ? morgan("common") : morgan("dev");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
  }));
  app.use(helmet());
  app.use(cookieParser());
  app.use(morganMiddleware);
  app.use('/birdhouse', birdhouseRouter);
  app.use('/user', userRouter);
  app.use('/order', orderRouter);
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome!');
  });
  return app;
};

export { createServer };
