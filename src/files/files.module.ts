import { MiddlewareConsumer, Module } from '@nestjs/common';

import { NotesModule } from '../notes/notes.module';
import { FolderModule } from '../folders/folders.module';
import { UserModule } from '../users/user.module';
import { AuthenticationMiddleware } from '../users/authentication.middleware';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [NotesModule, FolderModule, UserModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(FilesController);
  }
}
