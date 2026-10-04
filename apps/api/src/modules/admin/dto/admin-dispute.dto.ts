import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrictText } from '../../../common/validation';

export class ResolveDisputeDto {
  @ApiProperty({ enum: ['REFUND_BUYER', 'RELEASE_SELLER'], example: 'REFUND_BUYER' })
  @IsIn(['REFUND_BUYER', 'RELEASE_SELLER'], {
    message: "decision must be either 'REFUND_BUYER' or 'RELEASE_SELLER'",
  })
  decision: 'REFUND_BUYER' | 'RELEASE_SELLER';

  @ApiProperty({ example: 'Customer received damaged package. Carrier transit damage confirmed.' })
  @IsStrictText({
    minLength: 5,
    maxLength: 500,
    message: 'notes must be between 5 and 500 characters and cannot contain HTML markup',
  })
  notes: string;
}
