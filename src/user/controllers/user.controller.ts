import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user.dto";

const router = Router();

router.post('/register', async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, lastname, password } = req.body;
    const userDto = new CreateUserDto();
    userDto.email = email;
    userDto.lastname = lastname;
    userDto.name = name;
    userDto.password = password;
    const errors = await validate(userDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const userService = new UserService();
    const result = await userService.create(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.log(err.message, err.stack);
  }
});

export default router;
