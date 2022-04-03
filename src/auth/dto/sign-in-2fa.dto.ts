import { IsString } from 'class-validator';

export class SignIn2faDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  code: number;
}
