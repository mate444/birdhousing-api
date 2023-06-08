import cors from 'cors';
import express from 'express';
import birdhouseRouter from '../birdhouse/controllers/birdhouse.controller';
import userRouter from '../user/controllers/user.controller';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const createServer = (): express.Application => {
  const app = express();
  const morganMiddleware = process.env.NODE_ENV === 'production' ? morgan("common") : morgan("dev");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(morganMiddleware);
  app.use('/birdhouse', birdhouseRouter);
  app.use('/user', userRouter);
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome!');
  });
  return app;
};

export { createServer };
