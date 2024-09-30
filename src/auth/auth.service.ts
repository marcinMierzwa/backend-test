import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register-dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/login-dto';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { ConfirmService } from 'src/confirm/confirm.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly confirmService: ConfirmService,
  ) {}

  // #REGISTER
  async register(email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Fields password and confirm password must be the same',
      );
    }

    const emailInUse = await this.userService.isEmailInUse(email);

    if (emailInUse) {
      throw new BadRequestException(
        'Sorry! Email adress is already in use, try to choose antoher one',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const googleId = '';
    const authMethod = 'local';
    const isEmailAdressConfirmed = false;
    const avatarUrl = '';

    const user = await this.userService.saveUser(
      email,
      hashedPassword,
      googleId,
      authMethod,
      isEmailAdressConfirmed,
      avatarUrl,
    );

    // save confirmation email model in data base
    return await this.confirmService.createConfirmationEmailModel(user.email);
  }

  // #LOGIN
  async Login(loginRequestBody: LoginDto) {
    const { email, password } = loginRequestBody;
    const user = await this.validateCredentials(email, password);
    const tokens = await this.generateTokens(user.id);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: tokens.userId,
    };
  }

  // #validate login credentials
  async validateCredentials(email, password) {
    const user = await this.userService.findValidatedUser(email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('invalid credentials');
    }
    if (user.isEmailAdressConfirmed === false) {
      throw new BadRequestException({
        statusCode: 401,
        error: 'Bad Request',
        message:
          'Sorry! Your Email adress is not confirm, please check your email inbox (also span folder) and verify your email',
      });
    }

    return user;
  }

  // #generate tokens
  async generateTokens(userId: mongoose.Types.ObjectId) {
    
    const accessToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '20s' },
    );
    const refreshToken = await this.jwtService.signAsync({ userId });

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId
    };
  }

  // #refresh access token
  async refreshAccessToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken);
    const userId = payload.userId;
    const accessToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '20s' },
    );
    return {
      accessToken: accessToken,
    };
  }

  // #store refresh token in dataBase
  async storeRefreshToken(
    refreshToken: string,
    payload: mongoose.Types.ObjectId,
  ) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    await this.userService.storeRefreshToken(expiryDate, refreshToken, payload);
  }

  //#GOOGLE LOGIN
  async validateGoogleUser(email: string, googleId: string, avatarUrl: string) {
    const hashedPassword = '';
    const authMethod = 'google';
    const isEmailAdressConfirmed = true;
    const user = await this.userService.isEmailInUse(email);

    if (!user) {
      const user = await this.userService.saveUser(
        email,
        hashedPassword,
        googleId,
        authMethod,
        isEmailAdressConfirmed,
        avatarUrl,
      );
      return user
    }
    if (user.authMethod === 'local') {
     const user =  await this.userService.updateUser(
        email,
        googleId,
        authMethod,
        isEmailAdressConfirmed,
        avatarUrl,
      );
      return user
    }
    return user;
  }
}
