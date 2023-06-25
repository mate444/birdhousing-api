import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Birdhouse } from '../birdhouse/entities/Birdhouse.entity';
import { Birdhouse_picture } from '../birdhouse/entities/Birdhouse_picture.entity';
import { Birdhouse_style } from '../birdhouse/entities/Birdhouse_style.entity';
import { User } from '../user/entities/User.entity';
import { User_role } from '../user/entities/User_role.entity';
import { User_permission } from '../user/entities/User_permission';
import { User_address } from '../user/entities/User_address';
import { Order } from '../order/entities/order.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(`${process.env.DB_PORT}`),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Birdhouse,
    Birdhouse_picture,
    Birdhouse_style,
    Order,
    User,
    User_address,
    User_permission,
    User_role
  ],
  synchronize: false,
  logging: false
});

const Manager = AppDataSource.manager;

export {
  AppDataSource,
  Manager
};
