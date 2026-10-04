import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrictText } from '../../../common/validation';

export class PayoutBankInfoDto {
  @ApiProperty({ example: 'Nabil Bank Limited' })
  @IsStrictText({
    minLength: 2,
    maxLength: 100,
    message: 'bankName must be between 2 and 100 characters and cannot contain HTML markup',
  })
  bankName: string;

  @ApiProperty({ example: '01234567890123' })
  @IsString({ message: 'accountNumber must be a string' })
  @IsNotEmpty({ message: 'accountNumber cannot be empty' })
  @MaxLength(50, { message: 'accountNumber must not exceed 50 characters' })
  accountNumber: string;
}

export class RequestPayoutDto {
  @ApiProperty({ example: 25000, description: 'Payout request amount' })
  @IsNumber({}, { message: 'amount must be a valid number' })
  @IsPositive({ message: 'amount must be positive' })
  @Max(100000000, { message: 'amount exceeds maximum payout limit' })
  amount: number;

  @ApiProperty({ type: PayoutBankInfoDto })
  @ValidateNested()
  @Type(() => PayoutBankInfoDto)
  bankInfo: PayoutBankInfoDto;
}
