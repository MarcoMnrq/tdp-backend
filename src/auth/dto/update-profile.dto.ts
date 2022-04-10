import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}
