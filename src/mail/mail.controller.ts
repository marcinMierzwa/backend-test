import { Controller, Get, Param, Redirect, Req, Res, UseInterceptors } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInterceptorInterceptor } from 'src/interceptors/register-interceptor/register-interceptor.interceptor';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) {}


@Get(':token')
@UseInterceptors(RegisterInterceptorInterceptor)
async reciveConfirmationEmail (
  @Param('token') token: string,
  @Res() res,
  @Req() req,
) {
  res.status(302).redirect(`http://localhost:4200/login`)
  console.log(req.error);
  
 await this.mailService.updateConfimationEmailAdress(token);
}

@Get()
test(){
  return {message: 'hello'}
}


}
