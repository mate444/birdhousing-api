import { createServer } from './config/express';
import "reflect-metadata";
import { AppDataSource } from './database/connection';
require('dotenv').config();

const startServer = async (): Promise<void> => {
  const app = await createServer();
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on http://localhost:3000');
    AppDataSource.initialize()
      .then(() => {
        console.log('Connected to database');
      }).catch(err => console.log(err));
  });
};

startServer();
