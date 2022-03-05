import {
  Injectable,
  NestMiddleware,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
require('dotenv').config();

import { User } from './user.model';

declare global {
  namespace Express {
    interface Request {
      userID: string;
      user: any;
    }
  }
}
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async use(@Req() request: Request, respose: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer'))
      throw new UnauthorizedException('Invalid Username or Password');

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await this.userModel.findById(payload.userID);

      if (!user)
        throw new UnauthorizedException('Invalid Username or Password');

      request.userID = payload.userID;
      request.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid Username or Password');
    }
  }
}
