import { rateLimit } from "express-rate-limit";
import { Request, Response, NextFunction } from 'express';

export const loginConsecutiveLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 30 seconds
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req:Request, res:Response, next:NextFunction) => {
    return res.status(429).send('Too many requests');
  }
});

export const loginDayLimiter = rateLimit({
  windowMs: 86400000, // 1 day
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req:Request, res:Response, next:NextFunction) => {
    return res.status(429).send('Too many requests');
  }
});
