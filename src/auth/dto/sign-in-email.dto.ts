import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class SignInEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  rememberMe: boolean;

  @IsString()
  token: string;
}
