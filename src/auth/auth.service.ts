import { BadRequestException, Injectable} from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register-dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/login-dto';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongoose';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    private jwt: JwtService,
    private readonly mailService: MailService,
  ) {}

  // #register
  async register(registerRequestBody: RegisterDto) {
    
    const { email, password, confirmPassword } = registerRequestBody;

    if (password !== confirmPassword) {
      throw new BadRequestException('Fields password and confirm password must be the same');
    }

    const emailInUse = await this.userService.isEmailInUse(email);

    if (emailInUse) {
      throw new BadRequestException('Sorry! Email adress is already in use, try to choose antoher one');
    }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userService.saveUser({ email, hashedPassword });
      
      const emailConfirmationToken = await this.mailService.confirmEmailAdress(user.email);

      return {
        message: `Success!. It's great that you joined us, now check your email inbox and confirm your email adress`,
        email: user.email,
        id: user._id,
        emailConfirmationToken: emailConfirmationToken
      }
    }
  


// #login
async Login(loginRequestBody: LoginDto) {
    const {email, password} = loginRequestBody;
    const user = await this.validateCredentials(email, password);
    const tokens = await this.generateTokens(user.id);
        return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: tokens.userId,
        isEmailAdressConfirmed: user.isEmailAdressConfirmed,
    }

    
   
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
    if(user.isEmailAdressConfirmed === false) {
      // this.mailService.confirmEmailAdress(user.email);
      throw new BadRequestException({
        "statusCode": 401,
        "error": "Bad Request",
        "message": ["Sorry! Your Email adress is not confirm, please check your email inbox (also span folder) and verify your email"]
      });
    }

    return user;
    
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
