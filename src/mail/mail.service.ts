import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { TransportOptions } from 'src/models/transport-options';

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
  ) {}

  // sending email options
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

  optionsTransport(options: TransportOptions) {
    const { email, subject, html } = options;
    const transportOptions: Mail.Options = {
      from: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      to: email,
      subject: subject,
      html: html,
    };
    return transportOptions;
  }
    // sending confirmation email
    async sendEmailConfirmation(options: TransportOptions) {
    try {
      await this.mailTransport().sendMail(this.optionsTransport(options));
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException(
        'Confirmation email not send',
        error.message,
      );
    }
    return {
      message:
        'Email resent succefully, now check your inbox mail and confirm your email adress',
    };
  }


    // sending reset email
    async sendResetEmail(options: TransportOptions) {
      try {
        await this.mailTransport().sendMail(this.optionsTransport(options));
      } catch (error) {
        Logger.error(error.message);
        throw new UnauthorizedException('email not send', error.message);
      }
    }
  
}
