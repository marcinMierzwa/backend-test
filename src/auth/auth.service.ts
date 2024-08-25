import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register-dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/login-dto';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    private jwt: JwtService
  ) {}

  // #register
  async register(registerRequestBody: RegisterDto) {
    
    const { email, password, confirmPassword } = registerRequestBody;

    if (password !== confirmPassword) {
      throw new BadRequestException('password is not the same');
    }

    const emailInUse = await this.userService.isEmailInUse(email);

    if (emailInUse) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userService.saveUser({ email, hashedPassword });
      return {
        message: `Thank you! ${email}. It's great that you joined us, now check your email to fully activate your account and login`,
        email: user.email,
        id: user._id,
      }
    }
  }


// #login
async Login(loginRequestBody: LoginDto) {
    const {email, password} = loginRequestBody;
    const userId = await this.validateCredentials(email, password);
    const tokens = await this.generateTokens(userId);
        return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: tokens.userId,
    }

    
   
}

// #validate login credentials
async validateCredentials(email, password) {
    const user = await this.userService.findValidatedUser(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('invalid credentials');
    }
    return user.id;
  }
    
    
     


// #generate tokens
async generateTokens(userId) {
    const accessToken = await this.jwt.signAsync({userId}, {expiresIn: '20s'});
    const refreshToken = await this.jwt.signAsync({userId});

    await this.storeRefreshToken(refreshToken, userId)
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId
    }
}

// #refresh access token
async refreshAccessToken(refreshToken: string) {
  const payload = await this.jwt.verifyAsync(refreshToken);
  const userId = payload.userId
  const accessToken = await this.jwt.signAsync({userId}, {expiresIn: '20s'});
  return {
    accessToken: accessToken
  }
}

// #store refresh token in dataBase
async storeRefreshToken(refreshToken: string, payload: ObjectId) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  await this.userService.storeRefreshToken(expiryDate, refreshToken, payload);
}

}
