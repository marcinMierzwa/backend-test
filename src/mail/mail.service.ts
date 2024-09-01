import { Injectable } from '@nestjs/common';
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

  async confirmEmailAdress(user_email: string, user_id: unknown) {
    const user = await this.userService.getUserToConfirmEmail(user_email);
    const { email, _id, isEmailAdressConfirmed } = user;
    const emailConfirmationToken = await this.jwtService.signAsync(
      { email, _id },
      { expiresIn: '60 days' },
    );
    const confirmationEmailUrl = `http://localhost:3000/mail/${emailConfirmationToken}`;

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
        const result = await transport.sendMail(options);
        return result;
      } catch (error) {
        console.log(error);
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

  async updateConfimationEmailAdress(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    const user = await this.userService.updateConfimationMailAdress(payload._id);
    const {password, ...rest} = user;
    console.log(rest);
  }

}
