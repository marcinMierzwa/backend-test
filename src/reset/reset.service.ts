import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { ResetToken } from 'src/schemas/reset-token';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ResetService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async forgotPassword(email: string) {
    const user = await this.userService.findUserForgotPassword(email);
    const resetToken = nanoid();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    if (user) {
      await this.userService.saveResetToken(resetToken, expiryDate, user._id);
      const resetUrl = `http://localhost:4200/reset-password?token=${resetToken}`;
      const options = {
        email: user.email,
        subject: 'Reset password',
        html: `<p>Welcome <strong>${email}</strong></p>
                <br>
                <p>click the link below to reset your password</p>
                <a
                href="${resetUrl}">
                Reset password</a>`,
      };
      await this.mailService.sendResetEmail(options);
    }

    return {
      message: 'If this email exists, you will recive an email',
    };
  }
}
