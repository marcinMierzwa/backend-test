import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register-dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService) {}

// #register
async register(registerRequestBody: RegisterDto) {
    const {email, password, confirmPassword} = registerRequestBody;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.saveUser({email, hashedPassword})
    console.log(user);
    
}
}
