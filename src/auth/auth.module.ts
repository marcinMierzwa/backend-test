import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from 'src/schemas/refresh-token.schema';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfirmationEmailToken, ConfirmationEmailTokenSchema } from 'src/schemas/confirmatoin-email-tokem';
import { ResetToken, ResetTokenSchema } from 'src/schemas/reset-token';
import { ConfirmModule } from 'src/confirm/confirm.module';

@Module({
  imports: [
    UserModule, MailModule, ConfirmModule,
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

    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
