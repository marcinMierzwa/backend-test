import { Controller, Get, Param, Redirect } from '@nestjs/common';
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
// @Redirect('https://localhost:4200/home', 302)
async reciveConfirmationEmail (@Param('token') token: string) {
  return await this.mailService.updateConfimationEmailAdress(token);
}

}
