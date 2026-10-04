import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ example: 'var-sony-wh1000xm5-blk' })
  @IsString({ message: 'variantId must be a string' })
  @IsNotEmpty({ message: 'variantId cannot be empty' })
  @MaxLength(100, { message: 'variantId must not exceed 100 characters' })
  variantId: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 100 })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  @Max(100, { message: 'quantity cannot exceed 100 units per item' })
  quantity: number = 1;
}
