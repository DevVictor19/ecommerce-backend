import { IsString, Length } from 'class-validator';

export class CardDto {
  @IsString()
  @Length(3, 55)
  holderName: string;

  @IsString()
  @Length(16, 16)
  number: string;

  @IsString()
  @Length(2, 2)
  expiryMonth: string;

  @IsString()
  @Length(4, 4)
  expiryYear: string;

  @IsString()
  @Length(3, 3)
  ccv: string;
}
