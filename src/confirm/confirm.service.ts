import { Injectable } from '@nestjs/common';
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
  async createConfirmationEmailModel(
    email: string,
    userId: mongoose.Types.ObjectId,
  ) {
    const emailConfirmationToken = nanoid(16);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const confirmationEmailTokenModel = {
      userId,
      expiryDate,
      confirmationEmailToken: emailConfirmationToken,
      email,
    };
    //send confirmation email model to save in userService data base
    await this.userService.saveConfirmationEmailModel(
      confirmationEmailTokenModel,
    );
    // send conftirmation email transport options to mailService
    await this.createEmailConfirmationTransport(emailConfirmationToken, email);

    return {
        message: `Success!. It's great that you joined us, now check your email inbox and confirm your email adress`,
        emailConfirmationToken: emailConfirmationToken,
        email: email
      };
        
    
  }

  // create email confirmation sending transport options

  async createEmailConfirmationTransport(
    emailConfirmationToken: string,
    email: string,
  ) {
    const resetUrl = `http://localhost:3000/confirm?token=${emailConfirmationToken}`;
    const options = {
      email: email,
      subject: 'Email adress confirmation',
      html: `<p>Welcome <strong>${email}</strong></p>
                <br>
                <p>click the link below to confirm your email adress</p>
                <a
                href="${resetUrl}">
                Confirm your email</a>`,
    };
    // send conftirmation email transport options to mailService
    return await this.mailService.sendEmailConfirmation(options);
  }

  // async confirmEmailAdress(token: string) {}

  //        return {
  //     message: `Success!. It's great that you joined us, now check your email inbox and confirm your email adress`,
  //     email
  //   }

  //     if (user && isEmailAdressConfirmed === false) {

  //     const user = await this.userService.getUserToConfirmEmail(user_email);
  //     const { email, _id, isEmailAdressConfirmed } = user;
  //     const payload = { email, _id };
  //     const emailConfirmationToken = this.jwtService.sign(payload, {
  //       expiresIn: '30 days',
  //     });

  //     const confirmationEmailUrl = `http://localhost:3000/mail/${emailConfirmationToken}`;

  //     if (user && isEmailAdressConfirmed === false) {

  //       const options: Mail.Options = {
  //         from: this.configService.get<string>('DEFAULT_MAIL_FROM'),
  //         to: email,
  //         subject: 'email verification',
  //         html: `<p>Welcome <strong>${email}</strong></p>

  //               <br>
  //               <p>click the link below to confirm your email</p>
  //               <a
  //               href="${confirmationEmailUrl}"
  //               >
  //               ${confirmationEmailUrl}</a>`,
  //       };

  //       try {
  //         await this.mailTransport().sendMail(options);
  //         this.userService.storeEmailConfirmationToken(
  //           emailConfirmationToken,
  //           isEmailAdressConfirmed,
  //           _id,
  //         );
  //         return {
  //           message: 'Email resent succefully, now check your inbox mail and confirm your email adress'
  //         }
  //       } catch (error) {
  //         Logger.error(error.message);
  //         throw new UnauthorizedException(
  //           'Confirmation email not send',
  //           error.message,
  //         );
  //       }
  //     }
  //     return
  //   }
  // }
}
