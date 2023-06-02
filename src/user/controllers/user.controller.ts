import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { UserService } from "../services/user.service";
import { CreateUserDto, DeleteUserDto, UserLoginDto, UserUpdateDto, UserUpdatePasswordDto } from "../dtos/user.dto";
import { loginConsecutiveLimiter, loginDayLimiter } from "../../middleware/rateLimiters";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { isAdmin, isNotLoggedIn } from "../../middleware/auth";

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
    const createdUser = await userService.create(req.body);
    const sessionToken = jwt.sign({
      role: createdUser.role,
      id: createdUser.id
    }, process.env.ACCESS_TOKEN, { expiresIn: '7 days' });
    const serializedSessionCookie = serialize('auth', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    res.setHeader('Set-Cookie', serializedSessionCookie);
    res.status(201).send(createdUser);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

// eslint-disable-next-line max-len
router.post('/login', loginConsecutiveLimiter, loginDayLimiter, async (req: Request, res: Response, next: NextFunction) => {
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
    const passwordValidationResult = await userService.verifyPassword(password, foundUser.password);
    if (!passwordValidationResult) return res.status(400).send("Wrong password");
    if (foundUser.status === 'inactive') return res.status(401).send("User is currently inactive");
    const sessionToken = jwt.sign({
      role: foundUser.role,
      id: foundUser.id
    }, process.env.ACCESS_TOKEN, { expiresIn: '7 days' });
    const serializedSessionCookie = serialize('auth', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week,
      path: '/'
    });
    res.setHeader('Set-Cookie', serializedSessionCookie);
    res.send(foundUser);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.get('/:id', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
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

router.delete('/', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
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
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.put('/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, newPassword } = req.body;
    if (password !== newPassword) return res.status(400).send('Passwords do not match');
    const userDto = new UserUpdatePasswordDto();
    userDto.email = email;
    userDto.newPassword = newPassword;
    userDto.password = password;
    const errors = await validate(userDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const userService = new UserService();
    const updatedPassword = await userService.updatePassword(email, newPassword);
    res.send(updatedPassword);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.delete('/logout', (req: Request, res: Response, next: NextFunction) => {
  try {
    const logOutCookie = serialize('auth', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    res.setHeader('Set-Cookie', logOutCookie);
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message, err.stack);
  }
});

export default router;
