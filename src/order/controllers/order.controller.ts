import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { OrderService } from "../services/order.service";
import { isNotLoggedIn } from "../../middleware/auth";
import { CreateOrderDto, UpdateOrderStatusDto } from "../dtos/order.dto";

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

router.patch('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, id } = req.body;
    const orderDto = new UpdateOrderStatusDto();
    orderDto.id = id;
    orderDto.status = status;
    const errors = await validate(orderDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const orderService = new OrderService();
    const updatedStatus = await orderService.updateStatus(req.body);
    if (updatedStatus === "Not found") return res.sendStatus(404);
    res.send(updatedStatus);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { page, search } = req.query;
    if (page === 'undefined') page = undefined;
    if (search === 'undefined') search = undefined;
    if (!page) return res.status(400).send('Page is required');
    const orderService = new OrderService();
    const orders = await orderService.getAll(search, parseInt(`${page}`));
    res.send(orders);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

export default router;
