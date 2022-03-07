import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FolderSchema } from './folders.model';
import { FolderService } from './folders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Folder', schema: FolderSchema }]),
  ],
  controllers: [],
  providers: [FolderService],
  exports: [FolderService, MongooseModule],
})
export class FolderModule {}
