import { ApiProperty } from '@nestjs/swagger';
import { IsCouponCode } from '../../../common/validation';

export class ApplyCouponDto {
  @ApiProperty({ example: 'DASHAIN2026' })
  @IsCouponCode()
  couponCode: string;
}
