import * as mongoose from 'mongoose';

import { materialColorPalletNames, MaterialColorPalletNames } from '../utils';

export interface Folder {
  id: string;
  name: string;
  tags: string[];
  path: string[];
  color: MaterialColorPalletNames;
  createdBy: string;
}

export const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide data'],
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
      default: 'amber',
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
