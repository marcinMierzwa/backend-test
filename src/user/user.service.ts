import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ConfirmationEmailToken } from 'src/schemas/confirmatoin-email-tokem';
import { RefreshToken } from 'src/schemas/refresh-token.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ConfirmationEmailToken.name) private confirmationEmailTokenModel: Model<ConfirmationEmailToken>,
    private readonly jwtService: JwtService,
  ) {}

  // #register

  // #check if email is already saved in data base
  async isEmailInUse(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }

  // #save user in data base
  async saveUser({ email, hashedPassword }) {
    return await this.userModel.create({
      email,
      password: hashedPassword,
      isEmailAdressConfirmed: false,
    });
  }

  // #login

  // #find validated user in data base with email and validate email

  async findValidatedUser(email) {
    return await this.userModel.findOne({ email });
  }

  // #store refreshToken in data base
  async storeRefreshToken(
    expiryDate: Date,
    refreshToken: string,
    userId: ObjectId,
  ) {
    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, refreshToken } },
      { upsert: true },
    );
  }

  // #get user from data base
  async getUser(userId) {
    const user = await this.userModel.findOne({ _id: userId });
    return {
      id: user._id,
      email: user.email,
      isEmailAdressConfirmed: user.isEmailAdressConfirmed,
    };
  }

  // #get user from data base to confirm email
  async getUserToConfirmEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async updateConfimationMailAdress(_id) {
    await this.userModel.findByIdAndUpdate(
      { _id },
      { isEmailAdressConfirmed: true },
    );
    await this.confirmationEmailTokenModel.findOneAndUpdate(
      { userId: _id },
      { isEmailAdressConfirmed: true },
    );

    return {
      message:
        'Thank you for confirmation your email adrress, now you can get access to your account and login',
    };
  }
  async storeEmailConfirmationToken(confirmationEmailToken: string, isEmailAdressConfirmed:boolean, userId) {
    const expiryDate = new Date();
    expiryDate.setDate(
      expiryDate.getDate() + 30,
    );

    await this.confirmationEmailTokenModel.updateOne(
      { userId },
      { $set: { confirmationEmailToken, isEmailAdressConfirmed, expiryDate } },
      { upsert: true },
    );
  }


  async confirmEmailConfirmation(token: string) {

    try {
      const uncodedPayload = await this.jwtService.verifyAsync(token);
      const userId = uncodedPayload._id;
      const user = await this.confirmationEmailTokenModel.findOne({ userId });
      await this.updateConfimationMailAdress(user.userId);
      } catch (err) {
        Logger.error(err.message);
        if(err.message === "jwt expired") {
          await this.deleteUser(token);
          throw new UnauthorizedException(
            'Email confirmation token has expired',
            err.message,)
          }
      }
  }
  async deleteUser(confirmationEmailToken: string) {
    const user = await this.confirmationEmailTokenModel.findOne({confirmationEmailToken});
    const isEmailAdressConfirmed = user.isEmailAdressConfirmed;
    const _id = user.userId;
    if(isEmailAdressConfirmed === false) {
      try {
        await this.userModel.findByIdAndDelete({_id})
      } catch (error) {
        throw new UnauthorizedException('cannot delete user account. Account email adress confirmed');
      }
      try {
        await this.confirmationEmailTokenModel.findOneAndDelete({confirmationEmailToken})
      } catch (error) {
        throw new UnauthorizedException('cannot delete user account. Account email adress confirmed');
      }
    }
    return {
      message: 'account delated'
    }
    
  }

}
