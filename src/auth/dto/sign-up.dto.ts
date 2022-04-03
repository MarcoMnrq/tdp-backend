import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/users/user-role.enum';

export class SignUpDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEnum(UserRole)
  readonly role: UserRole;
}
