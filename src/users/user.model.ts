import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

export interface User {
  userID: string;
  name: string;
  email: string;
  password: string;
  theme: 'light' | 'dark';
  isPasswordCorrect(givenPassword: string): Promise<boolean>;
  createJWT(): string;
}

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, `Name is required`],
      maxlength: 50,
      minLength: 3,
    },
    email: {
      type: String,
      require: [true, `Email is required`],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      require: [true, `Password is required`],
      minLength: 5,
    },
    theme: {
      type: String,
      default: 'dark',
      enum: {
        values: ['light', 'dark'],
        message: 'Theme is not supported',
      },
    },
    // TODO: Layout of the edit and preview. This would be like do you want a top down or left right split of the edit and preview window
    // layout: {
    //     type: String,
    //     default: "h",
    //     enum: {
    //         values: ["h", "v"],
    //         message: "Theme is not supported",
    //     },
    // },
  },
  { timestamps: true },
);

UserSchema.methods.isPasswordCorrect = async function (givenPassword: string) {
  return await bcrypt.compare(givenPassword, this.password);
};

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME!,
  });
};
