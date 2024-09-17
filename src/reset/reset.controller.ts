import { Body, Controller, Post } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ForgotPasswordDto } from 'src/dtos/forgot-password-dto';

@Controller('reset')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

    // #forgotPassword
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return await this.resetService.forgotPassword(forgotPasswordDto.email)
    }
  
}
