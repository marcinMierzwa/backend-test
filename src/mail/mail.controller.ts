import { Controller, Get, Param, Query, Redirect, Req, Res, UseInterceptors } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInterceptorInterceptor } from 'src/interceptors/register-interceptor/register-interceptor.interceptor';
import { PassThrough } from 'stream';

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



}
