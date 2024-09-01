import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from 'src/schemas/refresh-token.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema
      },
    ]),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
