import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
}
