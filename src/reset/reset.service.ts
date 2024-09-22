import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { ChangePasswordDto } from 'src/dtos/change-password-dto';
import { ResetPasswordDto } from 'src/dtos/reset-password-dto';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
  ) {}

  // #### FORGOT PASSWORD
  async forgotPassword(email: string) {
    const user = await this.userService.findUserForgotPassword(email);
    const resetToken = nanoid();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 10);
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

  // #### RESET PASSWORD
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, resetToken } = resetPasswordDto;
    const resetTokenModel =
      await this.userService.findResetTokenModel(resetToken);
    const userId = resetTokenModel.userId;

    if (!resetTokenModel || resetTokenModel.expiryDate < new Date()) {
      throw new BadRequestException('Invalid link');
    }

    return await this.userService.findUserResetPassword(userId, newPassword);
  }

  // #### CHANGE PASSWORD
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: mongoose.Types.ObjectId,
  ) {
  // find user in data base
  const {oldPassword, newPassword} = changePasswordDto;
  const user = await this.userService.findUserChangePassword(userId);
  if(!user) {
    throw new NotFoundException('User not found...')
  }
  // compare old and new password
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
if(!passwordMatch) {
  throw new UnauthorizedException('Wrong credentials')
}
// change and pass to save user password
const newHashedPassword = await bcrypt.hash(newPassword, 10);
return await this.userService.saveNewPassword(user._id, newHashedPassword);
  }
}
