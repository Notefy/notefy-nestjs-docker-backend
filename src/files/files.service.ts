import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Folder } from '../folders/folders.model';
import { FolderService } from '../folders/folders.service';
import { Note } from '../notes/notes.model';
import { NoteService } from '../notes/notes.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel('Folder') private readonly folderModel: Model<Folder>,
    @InjectModel('Note') private readonly noteModel: Model<Note>,
    private readonly folderService: FolderService,
    private readonly noteService: NoteService,
  ) {}

  async getFilesAtPathByUser({ createdBy, path }: any): Promise<any> {
    const folders = await this.folderModel.find({
      createdBy: createdBy,
      path: path,
    });
    const notes = await this.noteModel.find({
      createdBy: createdBy,
      path: path,
    });

    const result = {
      folders,
      notes,
      count: { folders: folders.length, notes: notes.length },
    };
    return result;
  }

  async getFilesAtRoot(userID: string): Promise<any> {
    const children = await this.getFilesAtPathByUser({
      createdBy: userID,
      path: { $size: 1 },
    });
    const result = { children };
    return result;
  }

  async getFile({ userID, fileID }: any): Promise<any> {
    // const fileID = req.params.id;

    // Check if fileID is a folder
    const file = await this.folderModel.findOne({
      _id: fileID,
      createdBy: userID,
    });
    if (file) {
      const subFilePath = [...file.path, file.name];
      const children = await this.getFilesAtPathByUser({
        createdBy: userID,
        path: subFilePath,
      });
      const result = { ...file.toObject(), children };
      return result;
    }

    // Check if fileID is a note
    const note = await this.noteModel.findOne({
      _id: fileID,
      createdBy: userID,
    });
    if (note) return { note };

    throw new ForbiddenException('Resource Not Found');
  }

  async createFile({ fileType, file }: any): Promise<any> {
    //   const fileType = req.body.type;

    if (fileType === 'folder') {
      const folder = await this.folderService.createFolder({
        folderName: file.name,
        folderColor: file.color,
        folderTags: file.tags,
        folderPathString: file.path,
        createdBy: file.userID,
      });
      return folder;
    }

    if (fileType === 'note') {
      const note = await this.noteService.createNote({
        noteTitle: file.title,
        noteData: file.data,
        noteTags: file.tags,
        notePathString: file.path,
        createdBy: file.userID,
      });
      return note ;
    }

    throw new ForbiddenException('Resource Not Found');
  }

  async updateFile({
    fileID,
    userID,
    updatedfileDetails,
    type,
  }: any): Promise<any> {
    // const fileID = req.params.id;

    // Check if fileID is a folder
    const file = await this.folderModel.findOne({
      _id: fileID,
      createdBy: userID,
    });
    if (file) {
      const result = await this.folderService.updateFolder({
        folderID: fileID,
        updateType: type,
        newFolderName: updatedfileDetails.name,
        newFolderTags: updatedfileDetails.tags,
        newFolderPathString: updatedfileDetails.path,
        newFolderColor: updatedfileDetails.color,
        createdBy: userID,
      });
      return { result };
    }

    // Check if fileID is a note
    const note = await this.noteModel.findOne({
      _id: fileID,
      createdBy: userID,
    });
    if (note) {
      const result = await this.noteService.updateNote({
        noteID: fileID,
        newNoteTitle: updatedfileDetails.title,
        newNoteData: updatedfileDetails.data,
        newNoteTags: updatedfileDetails.tags,
        newNotePath: updatedfileDetails.path,
        createdBy: userID,
      });
      return { result };
    }

    throw new ForbiddenException('Resource Not Found');
  }

  async deleteFile({ fileID, userID }: any): Promise<any> {
    // const fileID = req.params.id;

    // Check if fileID is a folder
    const file = await this.folderModel.findOne({
      _id: fileID,
      createdBy: userID,
    });
    if (file) {
      const result = await this.folderService.deleteFolder({
        folderID: fileID,
        createdBy: userID,
      });
      return { result };
    }

    // Check if fileID is a note
    const note = await this.noteModel.findOne({
      _id: fileID,
      createdBy: userID,
    });
    if (note) {
      const result = await this.noteService.deleteNote({
        noteID: fileID,
        createdBy: userID,
      });
      return { result };
    }

    throw new ForbiddenException('Resource Not Found');
  }
}
