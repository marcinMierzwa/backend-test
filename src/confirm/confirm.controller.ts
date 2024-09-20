import { Controller } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import {
  Body,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ResendConfirmationEmailDto } from 'src/dtos/resend-confirmation-email-dto';
import { MailService } from 'src/mail/mail.service';
@Controller('confirm')
export class ConfirmController {
  constructor(private readonly confirmService: ConfirmService,
  ) {}

  @Get(':token')
  async confirmEmailAdress(@Res() res, @Param('token') token: string) {
    res.redirect('http://localhost:4200/login')
    // await this.confirmService.confirmEmailAdress(token);
  }

  // @Post('resend-confirmation-email')
  // async resendConfirmationEmail(
  //   @Body() body: ResendConfirmationEmailDto,
  //   @Res() res,
  // ) {
  //   const { email } = body;
  //   res.redirect('http://localhost:4200/login')
  //   return await this.mailService.confirmEmailAdress(email);
  // }
}
