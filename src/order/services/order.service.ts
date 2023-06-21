import { Birdhouse } from "../../birdhouse/entities/Birdhouse.entity";
import { Manager } from "../../database/connection";
import { Order } from "../entities/order.entity";
import { IOrder } from "../interfaces/order.interface";
import { User } from "../../user/entities/User.entity";

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
};
