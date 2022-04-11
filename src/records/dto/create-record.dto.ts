import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsNumber()
  time: number;

  @IsBoolean()
  success: boolean;

  @IsString()
  minigame: string;
}
