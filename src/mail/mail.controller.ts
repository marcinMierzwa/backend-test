import { Controller, Get, Param, Redirect, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) {}


@Get(':token')
async reciveConfirmationEmail (
  @Param('token') token: string,
  @Res() res
) {
  res.status(302).redirect(`http://localhost:4200/login`)
 await this.mailService.updateConfimationEmailAdress(token);
}



}
