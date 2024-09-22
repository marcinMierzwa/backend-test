import { Controller, Query } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import {
  Body,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { ResendConfirmationEmailDto } from 'src/dtos/resend-confirmation-email-dto';
@Controller('confirm')
export class ConfirmController {
  constructor(private readonly confirmService: ConfirmService,
  ) {}

  @Get()
  async confirmEmailAdress(@Res() res, @Query('token') token: string) {
    res.redirect('http://localhost:4200/login')
    return await this.confirmService.confirmEmailAdress(token);
  }

  @Post('resend-confirmation-email')
  async resendConfirmationEmail(
    @Body() body: ResendConfirmationEmailDto,
  ) {
    const { email, emailConfirmationToken } = body;
    return await this.confirmService.resendEmailConfirmationEmail (email, emailConfirmationToken);
  }
}
