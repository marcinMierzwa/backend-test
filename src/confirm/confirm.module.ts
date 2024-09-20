import { Module } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { ConfirmController } from './confirm.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ConfirmController],
  providers: [ConfirmService],
  exports: [ConfirmService]
})
export class ConfirmModule {}
