import { Body, Controller, Post, Put } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ForgotPasswordDto } from 'src/dtos/forgot-password-dto';
import { ResetPasswordDto } from 'src/dtos/reset-password-dto';

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
  
}
