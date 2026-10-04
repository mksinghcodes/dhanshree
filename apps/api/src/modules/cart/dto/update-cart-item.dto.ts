import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, minimum: 0, maximum: 100 })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(0, { message: 'quantity must be at least 0 (0 removes item)' })
  @Max(100, { message: 'quantity cannot exceed 100 units' })
  quantity: number;
}
