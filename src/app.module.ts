import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { UserModule } from './users/user.module';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI! + process.env.MONGO_DB_NAME!),
    UserModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
