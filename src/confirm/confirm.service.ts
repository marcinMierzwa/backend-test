import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose, { ObjectId } from 'mongoose';
import { nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { TransportOptions } from 'src/models/transport-options';
import { ConfirmationEmailToken } from 'src/schemas/confirmatoin-email-tokem';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConfirmService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
  ) {}

  //recive confirmation email model data from registration
  async createConfirmationEmailModel(email: string) {
    const emailConfirmationToken = nanoid(16);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const confirmationEmailTokenModel = {
      expiryDate,
      confirmationEmailToken: emailConfirmationToken,
      email,
    };
    //send confirmation email model to save in userService data base
    await this.userService.saveConfirmationEmailModel(
      confirmationEmailTokenModel,
    );
    // send conftirmation email transport options to mailService
    await this.createEmailConfirmationTransport(email, emailConfirmationToken);

    return {
      message: `Success!. It's great that you joined us, now check your email inbox and confirm your email adress`,
      emailConfirmationToken: emailConfirmationToken,
      email: email,
    };
  }

  // create email confirmation sending transport options

  async createEmailConfirmationTransport(
    email: string,
    emailConfirmationToken: string,
  ) {
    const resetUrl = `http://localhost:3000/confirm?token=${emailConfirmationToken}`;
    const options = {
      email: email,
      subject: 'Email adress confirmation',
      html: `<p>Welcome <strong>${email}</strong></p>
                <br>
                <p>click the link below to confirm your email adress, the link will be active for 30 days after this time the account will be deleted</p>
                <a
                href="${resetUrl}">
                Confirm your email</a>`,
    };
    // send conftirmation email transport options to mailService
    return await this.mailService.sendEmailConfirmation(options);
  }

  // resend conftirmation email
  async resendEmailConfirmationEmail(
    email: string,
    emailConfirmationToken: string,
  ) {
    await this.createEmailConfirmationTransport(email, emailConfirmationToken);
    return {
      message: 'Verification email resent, check your email inbox',
    };
  }

  // validate and change is email adress is confirmed
  async confirmEmailAdress(token: string) {
    const emailConfirmationToken = await this.userService.validateToken(token);
    const { expiryDate, confirmationEmailToken, email } =
      emailConfirmationToken;
    const user = await this.userService.findUserConfirmationEmail(email);
    const { isEmailAdressConfirmed, _id } = user;
    if (expiryDate < new Date() && isEmailAdressConfirmed === false) {
      await this.userService.deleteUser(email);
    } else {
      await this.userService.updateIsEmailAdressConfirmed(email);
      await this.userService.deleteEmailConfirmationModel(email);
      return {
        message:
          'Thank you, your email address has been confirmed and you can log in to your account',
      };
    }
    return
  }
}
