import * as mongoose from 'mongoose';

import { materialColorPalletNames, MaterialColorPalletNames } from '../utils';

export interface Note {
  id: string;
  title: string;
  data: string;
  tags: string[];
  path: string[];
  color: MaterialColorPalletNames;
  createdBy: string;
}


export const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide title'],
    },
    data: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      trim: true,
    },
    path: {
      type: [String],
      trim: true,
      default: '/',
    },
    color: {
      type: String,
      default: 'grey',
      enum: {
        values: materialColorPalletNames,
        message: 'Color is not supported',
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true },
);
