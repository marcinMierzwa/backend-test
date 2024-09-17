import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from 'src/schemas/refresh-token.schema';
import { ConfirmationEmailToken, ConfirmationEmailTokenSchema } from 'src/schemas/confirmatoin-email-tokem';
import { ResetToken, ResetTokenSchema } from 'src/schemas/reset-token';

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
      {
        name: ConfirmationEmailToken.name,
        schema: ConfirmationEmailTokenSchema
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema
      },

    ]),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
