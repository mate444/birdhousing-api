import { IUserAddress, IUserInterface, UserStatusEnum } from "../interfaces/user.interface";
import { Manager } from "../../database/connection";
import { User } from "../entities/User.entity";
import { User_address } from "../entities/User_address";
import { User_role } from "../entities/User_role.entity";
import bcrypt from 'bcrypt';

export class UserService {
  entityManager = Manager;
  async create (data: IUserInterface) {
    try {
      const existingUser = await this.entityManager.findOne(User, {
        select: {
          id: true
        },
        where: {
          email: data.email
        }
      });
      if (existingUser) return false;
      const saltRounds = 10;
      const userRolename = 'client';
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      const createdUser = this.entityManager.create(User, {
        country: data.country,
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
          country: true,
          password: true
        },
        relations: ['role', 'address']
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

  async updateData (data: IUserInterface) {
    try {
      await this.entityManager.update(User, { id: data.id }, {
        country: data.country
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

  async createAddress (data: IUserAddress) {
    try {
      const createdAddress = this.entityManager.create(User_address, {
        address: data.address,
        city: data.city,
        country: data.country,
        lastname: data.lastname,
        name: data.name,
        phoneNumber: data.phoneNumber,
        postalCode: data.postalCode
      });
      const foundUser = await this.entityManager.findOne(User, {
        where: {
          id: data.userId
        },
        select: {
          id: true,
          addresses: true
        },
        relations: {
          addresses: true
        }
      });
      if (!foundUser) return false;
      foundUser.addresses.push(createdAddress);
      await this.entityManager.save(foundUser);
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
