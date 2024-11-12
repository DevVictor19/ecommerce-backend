import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  token: string;
}
