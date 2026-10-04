import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommissionRuleDto {
  @ApiProperty({ example: 10.0, description: 'Commission rate percentage between 0 and 100' })
  @IsNumber({}, { message: 'ratePercent must be a valid number' })
  @Min(0, { message: 'ratePercent cannot be negative' })
  @Max(100, { message: 'ratePercent cannot exceed 100%' })
  ratePercent: number;
}
