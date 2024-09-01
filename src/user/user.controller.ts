import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/quards/auth-guard';
import { UserService } from 'src/user/user.service';
import { EmailConfirmationResponse } from 'src/models/email-confirmation-response';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    // #get user
    @Get()
    @UseGuards(AuthGuard)
    async getUser(@Req() req) {
    return await this.userService.getUser(req.userId);
    }

    // #check if email is confirmed
    // @Get()
    // async isEmailConfirm(): Promise<EmailConfirmationResponse> {
    //     const user = a
    // }

    
}