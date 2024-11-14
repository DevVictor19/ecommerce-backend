import { Type } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { CardDto } from './card.dto';

export class CreateCreditCardChargeDto {
  @IsString()
  @Length(11, 11)
  document: string;

  @IsPositive()
  @IsInt()
  parcels: number;

  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}
