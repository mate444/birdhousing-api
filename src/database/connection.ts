import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Birdhouse } from '../birdhouse/entities/Birdhouse.entity';
import { Birdhouse_picture } from '../birdhouse/entities/Birdhouse_picture.entity';
import { Birdhouse_style } from '../birdhouse/entities/Birdhouse_style.entity';
import { User } from '../user/entities/User.entity';
import { User_role } from '../user/entities/User_role.entity';
import { User_permission } from '../user/entities/User_permission';
import { User_address } from '../user/entities/User_address';

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
    User,
    User_address,
    User_permission,
    User_role
  ],
  synchronize: false,
  logging: false
});

const Manager = AppDataSource.manager;

// AppDataSource.initialize().then(async () => {
//   const permissions = [
//     { permission: 'User Management' },
//     { permission: 'Product Management' },
//     { permission: 'Dashboard' },
//     { permission: 'Admin Management' }
//   ];
//   const createdPermission = Manager.create(User_permission, permissions);
//   await Manager.save(createdPermission);
//   const roles = [
//     { rolename: 'client', permissions: [createdPermission[0]] },
//     { rolename: 'admin', permissions: createdPermission }
//   ];
//   const createdRoles = Manager.create(User_role, roles);
//   await Manager.save(createdRoles);
// });

export {
  AppDataSource,
  Manager
};
