import { IsEmail, IsString} from "class-validator";

export class ResendConfirmationEmailDto {
    @IsEmail()
    email: string;

    @IsString()
    emailConfirmationToken: string;

}
