import { createServer } from './config/express';
require('dotenv').config();

const startServer = async (): Promise<void> => {
  const app = await createServer();
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on http://localhost:3000');
  });
};

startServer();
