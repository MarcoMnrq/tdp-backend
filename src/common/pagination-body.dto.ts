import { Type } from 'class-transformer';
import { IsOptional, Min, IsString, Max } from 'class-validator';

export class PaginationBodyDto {
  @IsString()
  @IsOptional()
  readonly filterBy: string;

  @Type(() => Number)
  @Min(0)
  @Max(100)
  readonly limit: number;

  @Type(() => Number)
  @Min(0)
  @Max(100)
  readonly offset: number;
}
