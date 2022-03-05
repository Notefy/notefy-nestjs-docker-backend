import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { UserSchema } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthenticationMiddleware } from './authentication.middleware';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: async () => {
          const schema = UserSchema;
          schema.pre('save', async function () {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'auth/user', method: RequestMethod.PATCH },
        { path: 'auth/user', method: RequestMethod.DELETE },
      );
  }
}
