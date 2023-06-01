import { UserInterface } from "../interfaces/user.interface";
import { Manager } from "../../database/connection";
import { User } from "../entities/User.entity";
import { User_permission } from "../entities/User_permission";
import { User_role } from "../entities/User_role.entity";
import bcrypt from 'bcrypt';

export class UserService {
  entityManager = Manager;
  async create (data: UserInterface) {
    try {
      const saltRounds = 10;
      const userRolename = 'client';
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      const createdUser = this.entityManager.create(User, {
        name: data.name,
        lastname: data.name,
        email: data.email,
        password: hashedPassword
      });
      const clientRole = await this.entityManager.findOne(User_role, {
        where: { rolename: userRolename },
        select: { id: true }
      });
      createdUser.role = clientRole.id;
      await this.entityManager.save(createdUser);
      return "Created";
    } catch (err) {
      throw new Error(err);
    }
  }
}
