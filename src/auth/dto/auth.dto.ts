import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @IsString({ message: 'Password is required' })
  password: string;
}
