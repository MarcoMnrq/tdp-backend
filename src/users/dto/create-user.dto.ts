import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly firstName: string;

  @IsEnum({ enum: UserRole, default: UserRole.REGULAR })
  readonly role: UserRole;
}
