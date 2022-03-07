import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from '../users/utils';

import { FilesService } from './files.service';

@Controller('file')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Get()
  getFilesAtRoot(@GetUser() userID: string): Promise<any> {
    return this.fileService.getFilesAtRoot(userID);
  }

  @Get(':id')
  getFile(
    @GetUser() userID: string,
    @Param('id') fileID: string,
  ): Promise<any> {
    return this.fileService.getFile({ userID, fileID });
  }

  @Post()
  createFile(
    @GetUser() userID: string,
    @Body('type') fileType: string,
    @Body('name') name: string,
    @Body('color') color: string,
    @Body('tags') tags: string,
    @Body('path') path: string,
    @Body('title') title: string,
    @Body('data') data: string,
  ): Promise<any> {
    console.log('here');
    let file;
    if (fileType === 'folder')
      file = {
        name,
        color,
        tags,
        path,
        userID,
      };
    else if (fileType === 'note')
      file = {
        title,
        data,
        tags,
        path,
        userID,
      };
    else throw new ForbiddenException('Resource Not Found');
    return this.fileService.createFile({ fileType, file });
  }

  @Patch(':id')
  updateFile(
    @GetUser() userID: string,
    @Param('id') fileID: string,
    @Body('type') type: string,
    @Body('name') name: string,
    @Body('color') color: string,
    @Body('tags') tags: string,
    @Body('path') path: string,
    @Body('title') title: string,
    @Body('data') data: string,
  ): Promise<any> {
    const updatedfileDetails = {
      name,
      color,
      tags,
      path,
      title,
      data,
    };
    return this.fileService.updateFile({
      fileID,
      userID,
      updatedfileDetails,
      type,
    });
  }

  @Delete(':id')
  deleteFile(
    @GetUser() userID: string,
    @Param('id') fileID: string,
  ): Promise<any> {
    return this.fileService.deleteFile({ fileID, userID });
  }
}
