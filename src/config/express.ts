import cors from 'cors';
import express from 'express';
import birdhouseRouter from '../birdhouse/controllers/birdhouse.controller';

const createServer = (): express.Application => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/birdhouse', birdhouseRouter);
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome!');
  });
  return app;
};

export { createServer };
