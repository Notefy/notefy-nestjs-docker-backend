import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FolderModule } from '../folders/folders.module';
import { NoteSchema } from './notes.model';
import { NoteService } from './notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    FolderModule,
  ],
  controllers: [],
  providers: [NoteService],
  exports: [NoteService, MongooseModule],
})
export class NotesModule {}
