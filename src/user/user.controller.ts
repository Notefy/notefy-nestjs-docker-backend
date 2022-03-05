import { Body, Controller, Delete, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationMiddleware } from './authentication.middleware';

import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(201)
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    return await this.userService.registerUser({ name, email, password });
  }

  @Post('login')
  @HttpCode(201)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    return await this.userService.signInUser({ email, password });
  }

  @Patch('user')
  @HttpCode(201)
  async update(
    @Req() request: Request,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('theme') theme: string,
  ): Promise<any> {
    return await this.userService.updateUser({
      id: request.userID,
      name,
      email,
      theme,
    });
  }

  @Delete('user')
  // @UseGuards(AuthenticationMiddleware)
  @HttpCode(200)
  async delete(
    @Req() request: Request,
    @Body('password') password: string,
  ): Promise<any> {
    return await this.userService.deleteUser({ id: request.userID, password });
  }
}
