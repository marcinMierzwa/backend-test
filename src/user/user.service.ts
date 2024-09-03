import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { RefreshToken } from 'src/schemas/refresh-token.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  // #register

  // #check if email is already saved in data base
  async isEmailInUse(email: string) {
    const emailInUse = await this.userModel.findOne({
      email: email,
    });
    if (emailInUse) {
      throw new BadRequestException('Sorry! email is already in use');
    } else {
      return true;
    }
  }

  // #save user in data base
  async saveUser({ email, hashedPassword}) {
    return await this.userModel.create({
      email,
      password: hashedPassword,
      isEmailAdressConfirmed: false,
    });
  }

  // #login

  // #find validated user in data base with email and validate email

  async findValidatedUser(email) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    
    return {
      email: user.email,
      password: user.password,
      id: user._id,
      isEmailAdressConfirmed: user.isEmailAdressConfirmed
    };
  }

  // #store refreshToken in data base
  async storeRefreshToken(expiryDate: Date, refreshToken: string, userId: ObjectId ) {
    await this.refreshTokenModel.updateOne({userId},{ $set: {expiryDate, refreshToken}}, {upsert:true});
  }

  // #get user from data base 
  async getUser(userId) {
    const user = await this.userModel.findOne({_id: userId});
    return {
      id: user._id,
      email: user.email,
      isEmailAdressConfirmed: user.isEmailAdressConfirmed
    }
  }

  // #get user from data base to confirm email
  async getUserToConfirmEmail(email:string) {
    return await this.userModel.findOne({email});
  }

  async updateConfimationMailAdress(_id) {
   return await this.userModel.findByIdAndUpdate({_id}, {isEmailAdressConfirmed: true});
  }


}
