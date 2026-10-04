import { IsEmail, IsNumber, IsPositive, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceBidDto {
  @ApiProperty({ example: 4500, description: 'Bid amount in local currency' })
  @IsNumber({}, { message: 'amount must be a valid number' })
  @IsPositive({ message: 'amount must be positive' })
  @Max(100000000, { message: 'amount exceeds maximum allowable bid' })
  amount: number;

  @ApiProperty({ example: 'bidder@example.com' })
  @IsEmail({}, { message: 'bidderEmail must be a valid email address' })
  @MaxLength(255, { message: 'bidderEmail must not exceed 255 characters' })
  bidderEmail: string;
}
