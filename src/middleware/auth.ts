import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../user/services/user.service';

export function isAdmin (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.cookies.auth) return res.sendStatus(401);
    jwt.verify(req.cookies.auth, process.env.ACCESS_TOKEN, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      try {
        const userService = new UserService();
        const foundUser = await userService.findOne({ id: user.id });
        if (!foundUser) return res.sendStatus(404);
        if (foundUser.role.rolename !== 'admin') return res.sendStatus(403);
        next();
      } catch (err) {
        res.sendStatus(400);
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

// If it becomes necessary, add auth middleware for client role
