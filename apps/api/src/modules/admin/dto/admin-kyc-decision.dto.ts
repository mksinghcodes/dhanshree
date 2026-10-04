import { IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsStrictText } from '../../../common/validation';

export class AdminKycDecisionDto {
  @ApiProperty({ enum: ['VERIFY', 'REJECT'], example: 'VERIFY' })
  @IsIn(['VERIFY', 'REJECT'], { message: "decision must be either 'VERIFY' or 'REJECT'" })
  decision: 'VERIFY' | 'REJECT';

  @ApiPropertyOptional({ example: 'Verified corporate trade license and VAT documents' })
  @IsOptional()
  @IsStrictText({
    maxLength: 500,
    message: 'notes must not exceed 500 characters and cannot contain HTML markup',
  })
  notes?: string;

  @ApiPropertyOptional({ example: 8.5, description: 'Commission rate override percent between 0 and 100' })
  @IsOptional()
  @IsNumber({}, { message: 'commissionOverride must be a valid number' })
  @Min(0, { message: 'commissionOverride cannot be negative' })
  @Max(100, { message: 'commissionOverride cannot exceed 100%' })
  commissionOverride?: number;
}
