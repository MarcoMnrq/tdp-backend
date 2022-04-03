import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class UpdateRoleDto {
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  password: string;
}
