import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/(?=.*[A-Z])(?=.*\d)/, {message: 'Password must contains at least one number and one uppercase letter ' })
    password: string;

    @IsString()
    confirmPassword: string;

    
}