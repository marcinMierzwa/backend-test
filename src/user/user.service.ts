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
  async saveUser(
    email: string,
    hashedPassword: string,
    googleId: string, 
    authMethod: string,
    isEmailAdressConfirmed: boolean,
    avatarUrl: string
   ) {
    return await this.userModel.create({
      email,
      password: hashedPassword,
      googleId,
      authMethod,
      isEmailAdressConfirmed,
      avatarUrl,
    });
  }

  // #LOGIN

  // #find validated user in data base with email and validate email

  async findValidatedUser(email: string) {
    return await this.userModel.findOne({ email });
  }

  // #REFRESH TOKEN

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


  // #### CONFIRMATION EMAIL 
  async saveConfirmationEmailModel(confirmationEmailTokenModel) {
    await this.confirmationEmailTokenModel.create(confirmationEmailTokenModel);
  }

  // find user to verify is email confirmed
  async findUserConfirmationEmail(email: string) {
    return await this.userModel.findOne({email});
  }

  // find confiramation email token model to verify token expiry date
  async validateToken(confirmationEmailToken: string) {
    return await this.confirmationEmailTokenModel.findOne({confirmationEmailToken});
  }

  // delete user when token exipry
  async deleteUser(email: string) {
    await this.userModel.findOneAndDelete({email});
    return {
      message: 'user deleted'
    }
  }

  // update is adress email is confirm 
  async updateIsEmailAdressConfirmed(email: string) {
    await this.userModel.findOneAndUpdate({email, isEmailAdressConfirmed: true});
  }

  // delete email confirtmation token model after confitmation email adress
  async deleteEmailConfirmationModel(email: string) {
    await this.confirmationEmailTokenModel.findOneAndDelete({email});
  }



  // #### FORGOT PASSWORD  
  async findUserForgotPassword(email: string) {
  return await this.userModel.findOne({email});
}


  // #### RESET PASSWORD  
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

   // #### CHANGE PASSWORD  
   // find user in data base
   async findUserChangePassword(userId: mongoose.Types.ObjectId) {
    return await this.userModel.findById(userId);
   }

   // save new password
   async saveNewPassword(userId: mongoose.Types.ObjectId, newHashedPassword: string) {
    await this.userModel.findOneAndUpdate({userId, password: newHashedPassword});
    return {
      message: 'password has been changed successfully'
    }
   }


}




