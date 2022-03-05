import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async registerUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<any> {
    if (await this.userModel.findOne({ email }).exec())
      throw new UnauthorizedException('Invalid Username or Password');

    const user = new this.userModel({ name, email, password });
    const result = await user.save();

    const token = user.createJWT();

    return {
      user: {
        name: result.name,
        email: result.email,
        theme: result.theme,
      },
      token,
    };
  }

  async signInUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    if (!email || !password)
      throw new UnauthorizedException('Invalid Username or Password');

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid Username or Password');

    if (!(await user.isPasswordCorrect(password)))
      throw new UnauthorizedException('Invalid Username or Password');

    const token = user.createJWT();

    return {
      user: {
        name: user.name,
        email: user.email,
        theme: user.theme,
      },
      token,
    };
  }

  async updateUser({
    id,
    name,
    email,
    theme,
  }: {
    id: string;
    name: string;
    email: string;
    theme: string;
  }) {
    let updatedUser, token;
    try {
      updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          name,
          email,
          theme,
        },
        { new: true, runValidators: true },
      );
    } catch (error) {
      throw new ForbiddenException('Invalid Username or Password');
    }
    if (!updatedUser)
      throw new ForbiddenException('Invalid Username or Password');
    token = updatedUser.createJWT();
    return {
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        theme: updatedUser.theme,
      },
      token,
    };
  }

  async deleteUser({ id, password }: { id: string; password: string }) {
    if (!password)
      throw new UnauthorizedException('Invalid Username or Password');

    const user = await this.userModel.findById(id);
    if (!user)
      throw new UnauthorizedException('Invalid Username or Password');

    if (!(await user.isPasswordCorrect(password)))
      throw new UnauthorizedException('Invalid Username or Password');

    // TODO: Delete the notes and folder by user
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    return {
      msg: `${deletedUser?.name} deleted`,
    };
  }
}
