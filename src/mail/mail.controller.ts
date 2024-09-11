import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { UserService } from 'src/user/user.service';
import { RegisterInterceptorInterceptor } from 'src/interceptors/register-interceptor/register-interceptor.interceptor';
import { ResendConfirmationEmailDto } from 'src/dtos/resend-confirmation-email-dto';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @Get(':token')
  async confirmEmailAdress(@Res() res, @Param('token') token: string) {
    res.redirect('http://localhost:4200/login')
    await this.userService.confirmEmailConfirmation(token);
  }

  @Post('resend-confirmation-email')
  async resendConfirmationEmail(
    @Body() body: ResendConfirmationEmailDto,
    @Res() res,
  ) {
    const { email } = body;
    res.redirect('http://localhost:4200/login')
    return await this.mailService.confirmEmailAdress(email);
  }
}
