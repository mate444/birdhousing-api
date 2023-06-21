import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { OrderService } from "../services/order.service";
import { isNotLoggedIn } from "../../middleware/auth";
import { CreateOrderDto } from "../dtos/order.dto";

const router = Router();

router.post('/', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { birdhouses, price, userId } = req.body;
    const orderDto = new CreateOrderDto();
    orderDto.birdhouses = birdhouses;
    orderDto.price = price;
    orderDto.userId = userId;
    const errors = await validate(orderDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const orderService = new OrderService();
    const createdOrder = await orderService.create(req.body);
    if (createdOrder === "Not found") return res.status(404).send(createdOrder);
    if (createdOrder === "Not enough stock") {
      return res.status(400).send("There is no more stock available for this birdhouse");
    }
    res.status(201).send(createdOrder);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

export default router;
