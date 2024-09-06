import { Controller, Get, Param, Query, Redirect, Req, Res, UseInterceptors } from '@nestjs/common';
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


@Get()
@UseInterceptors(RegisterInterceptorInterceptor)
async reciveConfirmationEmail (
  @Query('token') token: string,
  @Res({passthrough:true}) res,
  @Req() req,
) {
  console.log(req.userId);
  
  res.status(302).redirect(`http://localhost:4200/home`)
    res.cookie('emailToken', req.userId, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }); // 1 week

  
//  await this.userService.updateConfimationMailAdress(req.userId);
}

// @Get('test')
// @UseInterceptors(RegisterInterceptorInterceptor)
// test(
//   @Req() req,
  
// ){
//   console.log(req.userId);
// }


}
