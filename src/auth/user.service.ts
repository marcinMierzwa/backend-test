import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
constructor(@InjectModel(User.name) private userModel: Model<User>,
)
 {}

// #register user in data base
async saveUser({email, hashedPassword}): Promise<User> {
    const emailInUse = await this.userModel.findOne({
        email: email,
      });
      if (emailInUse) {
        throw new BadRequestException('Email already in use');
      }
      return this.userModel.create({
        email,
        hashedPassword
    })
}
}
