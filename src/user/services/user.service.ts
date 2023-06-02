import { UserInterface, UserStatusEnum } from "../interfaces/user.interface";
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
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword
      });
      const clientRole = await this.entityManager.findOne(User_role, {
        where: { rolename: userRolename },
        select: { id: true }
      });
      createdUser.role = clientRole;
      const userId = (await this.entityManager.save(createdUser)).id;
      const savedUser = await this.entityManager.findOne(User, {
        where: {
          id: userId
        },
        relations: ['role']
      });
      return savedUser;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne (key: { email: string } | { id: string }) {
    try {
      const whereOptions = key;
      const foundUser = await this.entityManager.findOne(User, {
        where: whereOptions,
        select: {
          id: true,
          email: true,
          lastname: true,
          name: true,
          password: true
        },
        relations: ['role']
      });
      return foundUser;
    } catch (err) {
      throw new Error(err);
    }
  }

  async softDelete (id: string, status: UserStatusEnum) {
    try {
      const deletedUserResult = await this.entityManager.update(User, { id }, { status });
      if (deletedUserResult.affected < 1) return false;
      if (status === 'inactive') {
        return 'Deleted';
      }
      if (status === 'active') {
        return "Restored";
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async verifyPassword (password:string, userPassword: string) {
    try {
      const result = await bcrypt.compare(password, userPassword);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateData (data: UserInterface) {
    try {
      await this.entityManager.update(User, { id: data.id }, {
        name: data.name,
        lastname: data.lastname
      });
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updatePassword (email: string, newPassword: string) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await this.entityManager.update(User, { email }, { password: hashedPassword });
      return "Updated";
    } catch (err) {
      throw new Error(err);
    }
  }
}
