import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ForgotPasswordDto } from 'src/dtos/forgot-password-dto';
import { ResetPasswordDto } from 'src/dtos/reset-password-dto';
import { ChangePasswordDto } from 'src/dtos/change-password-dto';
import { AuthGuard } from 'src/quards/auth-guard';

@Controller('reset')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

    // #forgotPassword
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return await this.resetService.forgotPassword(forgotPasswordDto.email)
    }

    // #resetPassword
    @Put('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return await this.resetService.resetPassword(resetPasswordDto);
    }

    // #changePassword
    @Put('change-password')
    @UseGuards(AuthGuard)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
      return this.resetService.changePassword(changePasswordDto, req.userId)
    }

  
}
