import { Body, Controller, Post, Res, Req, UnauthorizedException } from '@nestjs/common';
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
  ): Promise<Partial<User>> {
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
    const tokens = await this.authService.Login(loginRequestBody);
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;
    const userId = tokens.userId;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 1 week

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: userId
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
