import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../user/services/user.service';
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_APIKEY}`, {
  apiVersion: "2022-11-15"
});

export function isAdmin (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.cookies.auth) return res.sendStatus(401);
    jwt.verify(req.cookies.auth, process.env.ACCESS_TOKEN, async (err: unknown, user) => {
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

export function isNotLoggedIn (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.cookies.auth) return res.sendStatus(401);
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function isWebhookRequest (req: Request, res: Response, next: NextFunction) {
  try {
    // Get paymentIntent to verify auth token given on session creation.
    const paymentIntent = await stripe.paymentIntents.retrieve(req.body.data.object.id);
    if (!paymentIntent.id) return res.sendStatus(401);
    if (!paymentIntent.metadata.token) return res.sendStatus(401);
    jwt.verify(paymentIntent.metadata.token, process.env.ACCESS_TOKEN, async (err: unknown) => {
      if (err) {
        return res.sendStatus(403);
      }
    });
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
