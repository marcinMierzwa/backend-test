import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ConfirmationEmailToken } from 'src/schemas/confirmatoin-email-tokem';
import { RefreshToken } from 'src/schemas/refresh-token.schema';
import { ResetToken } from 'src/schemas/reset-token';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ConfirmationEmailToken.name) private confirmationEmailTokenModel: Model<ConfirmationEmailToken>,
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
  ) {}

  // #register

  // #check if email is already saved in data base
  async isEmailInUse(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }

  // #save registration user in data base
  async saveUser({ email, hashedPassword }) {
    return await this.userModel.create({
      email,
      password: hashedPassword,
      isEmailAdressConfirmed: false,
    });
  }

  // #login

  // #find validated user in data base with email and validate email

  async findValidatedUser(email: string) {
    return await this.userModel.findOne({ email });
  }

  // #refresh token

  // #store refreshToken in data base
  async storeRefreshToken(
    expiryDate: Date,
    refreshToken: string,
    userId: mongoose.Types.ObjectId,
  ) {
    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, refreshToken } },
      { upsert: true },
    );
  }

  // #guard
  // #get user from data base
  async getUser(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findOne({ _id: userId });
    return {
      id: user._id,
      email: user.email,
      isEmailAdressConfirmed: user.isEmailAdressConfirmed,
    };
  }

  // async storeEmailConfirmationToken(confirmationEmailToken: string, isEmailAdressConfirmed:boolean, userId: mongoose.Types.ObjectId) {
  //   const expiryDate = new Date();
  //   expiryDate.setDate(
  //     expiryDate.getDate() + 30,
  //   );

  //   await this.confirmationEmailTokenModel.updateOne(
  //     { userId },
  //     { $set: { confirmationEmailToken, isEmailAdressConfirmed, expiryDate } },
  //     { upsert: true },
  //   );
  // }


  // async confirmEmailConfirmation(token: string) {

  //   try {
  //     const uncodedPayload = await this.jwtService.verify(token);
  //     const data = await this.confirmationEmailTokenModel.findOne({userId: uncodedPayload._id});
  //     console.log(data);
      
  //     // await this.updateConfimationMailAdress(user.userId);

  //     } catch (err) {
  //       Logger.error(err.message);
  //       if(err.message === "jwt expired") {
  //         // await this.deleteUser(token);
  //         throw new UnauthorizedException(
  //           'Email confirmation token has expired',
  //           err.message,)
  //         }
  //     }
  // }
  // async deleteUser(confirmationEmailToken: string) {
  //   const user = await this.confirmationEmailTokenModel.findOne({confirmationEmailToken});
  //   const isEmailAdressConfirmed = user.isEmailAdressConfirmed;
  //   const _id = user.userId;
  //   if(isEmailAdressConfirmed === false) {
  //     try {
  //       await this.userModel.findByIdAndDelete({_id})
  //     } catch (error) {
  //       throw new UnauthorizedException('cannot delete user account. Account email adress confirmed');
  //     }
  //     try {
  //       await this.confirmationEmailTokenModel.findOneAndDelete({confirmationEmailToken})
  //     } catch (error) {
  //       throw new UnauthorizedException('cannot delete user account. Account email adress confirmed');
  //     }
  //   }
  //   return {
  //     message: 'account delated'
  //   }
    
  // }

  // #confirmation email 
  async saveConfirmationEmailModel(confirmationEmailTokenModel) {
    await this.confirmationEmailTokenModel.create(confirmationEmailTokenModel);
  }



  // #forgot password 
  async findUserForgotPassword(email: string) {
  return await this.userModel.findOne({email});
}

 async saveResetToken(resetToken: string, expiryDate: Date, userId: mongoose.Types.ObjectId) {
  await this.resetTokenModel.create({
    resetToken,
    expiryDate,
    userId
  });
 }

 async findResetTokenModel(resetToken: string) {
  return await this.resetTokenModel.findOneAndDelete({
    resetToken
  });
 }

 async findUserResetPassword(userId: mongoose.Types.ObjectId, newPassword:string) {
  const user = await this.userModel.findById({_id: userId})
  if(!user) {
    throw new InternalServerErrorException('user not found');
  }
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  return {
    message: 'password has changed successfully'
  }
 }

}
