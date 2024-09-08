import { Body, Controller, Get, Param, Post, Query, Redirect, Req, Res, UseInterceptors } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInterceptorInterceptor } from 'src/interceptors/register-interceptor/register-interceptor.interceptor';
import { PassThrough } from 'stream';
import { ResendConfirmationEmailDto } from 'src/dtos/resend-confirmation-email-dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) {}


@Get()
@UseInterceptors(RegisterInterceptorInterceptor)
async reciveConfirmationEmail (
  @Query('token') token: string,
  @Res() res,
  @Req() req,
) 
{
  res.status(302).redirect(`http://localhost:4200/login`)
 await this.userService.updateConfimationMailAdress(req.userId);
}

@Post('resend-confirmation-email')
async resendConfirmationEmail(
  @Body()body: ResendConfirmationEmailDto
) {
  const {email} = body;
  await this.mailService.confirmEmailAdress(email);
  return {
    message: 'email resent succesfull'
  }
  
}




}
