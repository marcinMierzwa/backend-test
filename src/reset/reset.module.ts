import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UserModule, MailModule],
  controllers: [ResetController],
  providers: [ResetService],
})
export class ResetModule {}
