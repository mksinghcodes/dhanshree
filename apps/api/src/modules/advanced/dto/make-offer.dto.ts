import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsStrictText } from '../../../common/validation';

export class MakeOfferDto {
  @ApiPropertyOptional({ example: 'auc-luxury-watch-01' })
  @IsOptional()
  @IsString({ message: 'auctionId must be a string' })
  @MaxLength(100)
  auctionId?: string;

  @ApiProperty({ example: 'Vikram Joshi' })
  @IsStrictText({
    minLength: 2,
    maxLength: 100,
    message: 'buyerName must be between 2 and 100 characters and cannot contain HTML markup',
  })
  buyerName: string;

  @ApiProperty({ example: 'buyer@example.com' })
  @IsEmail({}, { message: 'buyerEmail must be a valid email address' })
  @MaxLength(255)
  buyerEmail: string;

  @ApiProperty({ example: 42000 })
  @IsNumber({}, { message: 'offerAmount must be a valid number' })
  @IsPositive({ message: 'offerAmount must be positive' })
  @Max(100000000, { message: 'offerAmount exceeds maximum allowable offer' })
  offerAmount: number;

  @ApiPropertyOptional({ example: 'Ready to pay immediately if offer is accepted' })
  @IsOptional()
  @IsStrictText({
    maxLength: 500,
    message: 'message must not exceed 500 characters and cannot contain HTML markup',
  })
  message?: string;
}
