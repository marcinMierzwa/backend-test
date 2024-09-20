import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { TransportOptions } from 'src/models/transport-options';

@Injectable()
export class ConfirmService {
    constructor(private mailService: MailService) {}




//send confirmation email
    async saveConfirmationEmailModel(email: string, _id: mongoose.Types.ObjectId) {
       
        const emailConfirmationToken = nanoid(16);
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);



  

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
