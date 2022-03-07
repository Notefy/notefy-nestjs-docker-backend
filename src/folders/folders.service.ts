import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

import { Folder } from './folders.model';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel('Folder') private readonly folderModel: Model<Folder>,
  ) {}

  async doesFolderWithPathAndNameExists({
    folderPath,
    folderName,
    createdBy,
  }: any): Promise<any> {
    const folderlist = await this.folderModel
      .find({
        path: folderPath,
        createdBy,
      })
      .select('name path -_id');
    return Object.values(folderlist.map((_) => _.name)).includes(folderName);
  }

  async createFolder({
    folderName,
    folderColor,
    folderTags,
    folderPathString,
    createdBy,
  }: any): Promise<any> {
    const folderPath = folderPathString.split('/');

    // Folder path exists
    const validFolderPath = await this.doesFolderWithPathAndNameExists({
      folderPath: folderPath.slice(0, folderPath.length - 1),
      folderName: folderPath[folderPath.length - 1],
      createdBy: createdBy,
    });
    if (!(folderPath.length === 1 || validFolderPath))
      return { msg: 'Folder Doesnt Exists' };

    // Duplicate folder check
    const duplicateFolder = await this.doesFolderWithPathAndNameExists({
      folderPath,
      folderName,
      createdBy: createdBy,
    });
    if (duplicateFolder) return { msg: 'Folder Already Exists' };

    // Insert
    const doc = await this.folderModel.create({
      name: folderName,
      color: folderColor,
      tags: folderTags,
      path: folderPath,
      createdBy: createdBy,
    });
    const folder = doc.save();
    return folder;
  }

  async updateFolder({
    folderID,
    updateType,
    newFolderName,
    newFolderColor,
    newFolderTags,
    newFolderPathString,
    createdBy,
  }: any): Promise<any> {
    const folder = await this.folderModel.findOne({
      _id: folderID,
      createdBy: createdBy,
    });

    if (!folder) throw new ForbiddenException('Resource Not Found');

    // Color Update
    if (updateType === 'color') {
      const newFolderData = await this.folderModel.findOneAndUpdate(
        { _id: folderID, createdBy: createdBy },
        { $set: { color: newFolderColor } },
        { new: true, runValidators: true },
      );
      return { msg: 'Updated', newFolderData };
    }

    // Tags Update
    if (updateType === 'tags') {
      const newFolderData = await this.folderModel.findOneAndUpdate(
        { _id: folderID, createdBy: createdBy },
        { $set: { tags: newFolderTags } },
        { new: true, runValidators: true },
      );
      return { msg: 'Updated', newFolderData };
    }

    // Name update
    if (updateType === 'name') {
      // Update Child Folders
      let subfolder = 0;
      let matchObj: any = {};
      matchObj[`path.${folder.path.length}`] = newFolderName;

      this.folderModel
        .aggregate()
        .project({
          slicedPath: { $slice: ['$path', folder.path.length + 1] },
          createdBy: 1,
        })
        .match({
          slicedPath: [...folder.path, folder.name],
          createdBy: new mongoose.Types.ObjectId(createdBy),
        })
        .cursor({ batchSize: 100 })
        .eachAsync(async (doc) => {
          subfolder += 1;
          await this.folderModel.findByIdAndUpdate(
            doc._id,
            { $set: matchObj },
            { new: true, runValidators: true },
          );
        });

      // Update Current Folder
      const newFolder = await this.folderModel.findByIdAndUpdate(
        folderID,
        { $set: { name: newFolderName } },
        { new: true, runValidators: true },
      );

      return { msg: 'Updated', newFolder, subfolder: subfolder + 1 };
    }

    throw new ForbiddenException('Resource Not Found');
  }

  async deleteFolder({ folderID, createdBy }: any): Promise<any> {
    const folder = await this.folderModel.findOne({
      _id: folderID,
      createdBy: createdBy,
    });
    if (!folder) throw new ForbiddenException('Resource Not Found');

    // Delete Child Folders
    let subfolder = 0;
    this.folderModel
      .aggregate()
      .project({
        slicedPath: { $slice: ['$path', folder.path.length + 1] },
        createdBy: 1,
      })
      .match({
        slicedPath: [...folder.path, folder.name],
        createdBy: new mongoose.Types.ObjectId(createdBy),
      })
      .cursor({ batchSize: 100 })
      .eachAsync(async (doc) => {
        subfolder += 1;
        await this.folderModel.findByIdAndDelete(doc._id);
      });

    // Delete Current Folder
    await this.folderModel.findByIdAndDelete(folderID);

    return { msg: 'Deleted', subfolder: subfolder + 1 };
  }
}
