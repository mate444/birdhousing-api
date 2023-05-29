import cors from 'cors';
import express from 'express';

const createServer = (): express.Application => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.json())
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome!');
  });
  return app;
}

export { createServer };
