import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register-dto';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // #register
    @Post('register')
    async register(@Body() registerRequestBody: RegisterDto)  {
      return this.authService.register(registerRequestBody);
    }
  }
  

