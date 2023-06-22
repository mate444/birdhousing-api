import { Birdhouse } from "../../birdhouse/entities/Birdhouse.entity";
import { Manager } from "../../database/connection";
import { Order } from "../entities/order.entity";
import { IOrder, OrderStatusEnum } from "../interfaces/order.interface";
import { User } from "../../user/entities/User.entity";
import { ILike } from "typeorm";

export class OrderService {
  entityManager = Manager;
  async create (data: IOrder) {
    try {
      const orderBirdhouses = [];
      const createdOrder = this.entityManager.create(Order, {
        price: data.price,
        calculatedArrival: null
      });
      for (const b of data.birdhouses) {
        const foundBirdhouse = await this.entityManager.findOne(Birdhouse, {
          where: {
            birdhouseId: b.id
          }
        });
        if (!foundBirdhouse) return "Not found";
        if (foundBirdhouse.stock < b.amount) return "Not enough stock";
        foundBirdhouse.stock -= b.amount;
        orderBirdhouses.push(foundBirdhouse);
      };
      createdOrder.birdhouses = orderBirdhouses;
      const foundUser = await this.entityManager.findOne(User, {
        where: {
          id: data.userId
        }
      });
      if (!foundUser) return "Not found";
      createdOrder.user = foundUser;
      await this.entityManager.save(createdOrder);
      return "Created";
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateStatus (data: { id: string, status: OrderStatusEnum }) {
    try {
      const updatedOrder = await this.entityManager.update(Order, {
        id: data.id
      }, {
        status: data.status
      });
      if (updatedOrder.affected < 1) return "Not found";
      return "Updated";
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAll (search: any, page: number) {
    try {
      const numItems = 10;
      const totalCount = await this.entityManager.count(Order);
      const totalPages = Math.ceil(totalCount / numItems);
      const findOptions = {
        relations: ['user'],
        select: {
          id: true,
          status: true,
          price: true,
          user: {
            email: true
          },
          updatedAt: true
        },
        skip: (page - 1) * numItems,
        take: numItems
      };
      if (search) {
        findOptions["where"] = {
          user: {
            email: ILike(`%${search}%`)
          }
        };
      }
      const orders = await this.entityManager.find(Order, findOptions);
      return { data: orders, totalPages };
    } catch (err) {
      throw new Error(err);
    }
  }
};
