import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { UserService } from "../services/user.service";
import { CreateUserDto, DeleteUserDto, UserLoginDto, UserUpdateDto } from "../dtos/user.dto";

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
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
    res.sendStatus(500);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userDto = new UserLoginDto();
    userDto.email = email;
    userDto.password = password;
    const errors = await validate(userDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const userService = new UserService();
    const foundUser = await userService.findOne({ email });
    if (!foundUser) return res.sendStatus(404);
    if (foundUser.status === 'inactive') return res.status(401).send("User is currently inactive");
    const passwordValidationResult = await userService.verifyPassword(password, foundUser.password);
    if (!passwordValidationResult) return res.status(400).send("Wrong password");
    res.send(foundUser);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userService = new UserService();
    const foundUser = await userService.findOne({ id });
    if (!foundUser) {
      return res.sendStatus(404);
    }
    res.send(foundUser);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, status } = req.body;
    const userDto = new DeleteUserDto();
    userDto.id = id;
    userDto.status = id;
    const userService = new UserService();
    const deletedUser = await userService.softDelete(id, status);
    if (!deletedUser) return res.sendStatus(404);
    res.send(deletedUser);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.patch('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, lastname, name } = req.body;
    const updateUserDto = new UserUpdateDto();
    updateUserDto.id = id;
    updateUserDto.lastname = lastname;
    updateUserDto.name = name;
    const errors = await validate(updateUserDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const userService = new UserService();
    const updatedUser = await userService.updateData(req.body);
    res.send(updatedUser);
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    res.sendStatus(500);
  }
});

export default router;
