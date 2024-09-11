import { Body, Controller, Post, Res, Req, UnauthorizedException, Redirect } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register-dto';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/login-dto';
import { LoginResponse } from 'src/models/login-response-model';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // #register
  @Post('register')
  async register(
    @Body() registerRequestBody: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ){
    res.status(200);
    return await this.authService.register(registerRequestBody);
    
  }

  // #login
  @Post('login')
  async Login(
    @Body() loginRequestBody: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    res.status(200);
    const user = await this.authService.Login(loginRequestBody);
    

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 1 week

    return {
      accessToken: user.accessToken,
      message: 'Successful login',
    };
  }
  // #logout
  @Post('logout')
  async logOut(
    @Res({ passthrough: true }) res: Response,
  ) {
    res.status(200);
    res.clearCookie('refreshToken');
    return {
      message: `succesfull logout`
    }
  }

  // #refresh
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.status(200);
    try {
      const refreshToken = req.cookies['refreshToken'];

      const accessToken = await this.authService.refreshAccessToken(refreshToken);

      return accessToken
           
    }
    catch (err) {
      throw new UnauthorizedException()
    }
}
}
