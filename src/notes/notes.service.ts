import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Note } from './notes.model';
import { FolderService } from '../folders/folders.service';

@Injectable()
export class NoteService {
  constructor(
    private folderService: FolderService,
    @InjectModel('Note') private readonly noteModel: Model<Note>,
  ) {}

  async createNote({
    noteTitle,
    noteData,
    noteTags,
    notePathString,
    createdBy,
  }: any): Promise<any> {
    const folderPath = notePathString.split('/');

    // Folder path exists
    const validFolderPath =
      await this.folderService.doesFolderWithPathAndNameExists({
        folderPath: folderPath.slice(0, folderPath.length - 1),
        folderName: folderPath[folderPath.length - 1],
        createdBy: createdBy,
      });

    if (!(folderPath.length === 1 || validFolderPath))
      return { msg: 'Folder Doesnt Exists' };

    // Insert
    const doc = await this.noteModel.create({
      title: noteTitle,
      data: noteData,
      tags: noteTags,
      path: folderPath,
      createdBy: createdBy,
    });
    const note = doc.save();

    return note;
  }

  async updateNote({
    noteID,
    newNoteTitle,
    newNoteData,
    newNoteTags,
    newNotePath,
    createdBy,
  }: any): Promise<any> {
    // const notePath = newNotePath.split("/");

    // Folder path exists
    const validFolderPath =
      await this.folderService.doesFolderWithPathAndNameExists({
        folderPath: newNotePath.slice(0, newNotePath.length - 1),
        folderName: newNotePath[newNotePath.length - 1],
        createdBy: createdBy,
      });
    if (!(newNotePath.length === 1 || validFolderPath))
      return { msg: 'Folder Doesnt Exists' };

    const note = await this.noteModel.findOneAndUpdate(
      { _id: noteID, createdBy: createdBy },
      {
        title: newNoteTitle,
        data: newNoteData,
        tags: newNoteTags,
        path: newNotePath,
      },
      { new: true, runValidators: true },
    );

    if (!note) throw new ForbiddenException('Resource Not Found');
    return { status: 'success', msg: `Note Updated`, note };
  }

  async deleteNote({ noteID, createdBy }: any): Promise<any> {
    const note = await this.noteModel.findOneAndDelete({
      _id: noteID,
      createdBy: createdBy,
    });

    if (!note) throw new ForbiddenException('Resource Not Found');
    return { status: 'success', msg: `Note Deleted` };
  }
}
