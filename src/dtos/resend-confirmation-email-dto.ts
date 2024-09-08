import { IsEmail} from "class-validator";

export class ResendConfirmationEmailDto {
    @IsEmail()
    email: string;
}
