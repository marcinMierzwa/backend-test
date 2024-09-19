import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ResetPasswordDto } from 'src/dtos/reset-password-dto';
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
    expiryDate.setSeconds(expiryDate.getSeconds() + 10);
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const {newPassword, resetToken} = resetPasswordDto;
    const resetTokenModel = await this.userService.findResetTokenModel(resetToken);
    if(!resetTokenModel || (resetTokenModel.expiryDate < new Date() )) {

        throw new BadRequestException('Invalid link')
        
    }
    return {
        message: 'password changed succesfully'
    }
    
  }
}
