import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ResetService {
    constructor(private userService: UserService ) {
        
    }

    async forgotPassword(email: string) {
        const user = await this.userService.findUserForgotPassword(email);
        console.log(user);
        
        if(user) {
          const options = {
            email: user.email,
            subject: 'Reset password',
            html: ``
          }
          
        }
    
    
        return {
          message: "If this email exists, you will recive an email"
        }
    
      }
         
}
