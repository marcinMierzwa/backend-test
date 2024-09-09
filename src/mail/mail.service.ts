import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

   async confirmEmailAdress(user_email: string) {
    const user = await this.userService.getUserToConfirmEmail(user_email);
    const { email, _id, isEmailAdressConfirmed } = user;
    const payload = {email, _id};
    const emailConfirmationToken = this.jwtService.sign(payload, {expiresIn: '1w'});
    
    const confirmationEmailUrl = `http://localhost:3000/mail/?token=${emailConfirmationToken}`;

    if (user && isEmailAdressConfirmed === false) {
      const transport = this.mailTransport();

      const options: Mail.Options = {
        from: this.configService.get<string>('DEFAULT_MAIL_FROM'),
        to: email,
        subject: 'email verification',
        html: `<p>Welcome <strong>${email}</strong></p>
      
              <br>
              <p>click the link below to confirm your email</p>
              <a
              href="${confirmationEmailUrl}"
              >
              ${confirmationEmailUrl}</a>`,
      };

      try {
        await transport.sendMail(options);
      } catch (error) {
        Logger.error(error.message);
        throw new UnauthorizedException('Confirmation email not send', error.message);
      }
    }

  }

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    return transporter;
  }


}
