import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateHolidaysDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsInt()
  year: number;

  @IsArray()
  @IsString({ each: true })
  holidays: string[];
}
