import { IsDate, IsDateString, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsDateString()
  dob: Date;
}
