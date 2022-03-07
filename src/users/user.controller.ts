import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import {
  DeleteUserRequestDto,
  DeleteUserResposeDto,
  GenericUserResposeDto,
  LoginUserRequestDto,
  RegisterUserRequestDto,
  UpdateUserRequestDto,
  GetUser,
} from './utils';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() userData: RegisterUserRequestDto,
  ): Promise<GenericUserResposeDto> {
    return await this.userService.registerUser(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Body() userData: LoginUserRequestDto,
  ): Promise<GenericUserResposeDto> {
    return await this.userService.loginUser(userData);
  }

  @Patch('user')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @GetUser() userID: string,
    @Body() updatedUserDetails: UpdateUserRequestDto,
  ): Promise<GenericUserResposeDto> {
    return await this.userService.updateUser({
      ...updatedUserDetails,
      id: userID,
    });
  }

  @Delete('user')
  @HttpCode(HttpStatus.OK)
  async delete(
    @GetUser() userID: string,
    @Body() userData: DeleteUserRequestDto,
  ): Promise<DeleteUserResposeDto> {
    return await this.userService.deleteUser({
      ...userData,
      id: userID,
    });
  }
}
