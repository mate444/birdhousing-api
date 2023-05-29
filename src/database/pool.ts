import dotenv from 'dotenv';
import mysql2 from 'mysql2';

dotenv.config();

const pool = mysql2.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  connectTimeout: 40000,
  port: parseInt(`${process.env.DB_PORT}`)
});

pool.getConnection((err, res) => {
  if (err) throw new Error(`${err}`);
  console.log('Connected to database');
});

export default pool;
