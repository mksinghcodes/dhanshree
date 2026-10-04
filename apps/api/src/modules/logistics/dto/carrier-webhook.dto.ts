import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsStrictText } from '../../../common/validation';

export class CarrierTrackingWebhookDto {
  @ApiProperty({ example: 'Delhivery' })
  @IsStrictText({ minLength: 2, maxLength: 50 })
  carrier: string;

  @ApiProperty({ example: 'AWB987654321' })
  @IsString({ message: 'awbNumber must be a string' })
  @IsNotEmpty({ message: 'awbNumber cannot be empty' })
  @MaxLength(100)
  awbNumber: string;

  @ApiProperty({ example: 'ORD-2026-0001' })
  @IsString({ message: 'orderNumber must be a string' })
  @IsNotEmpty({ message: 'orderNumber cannot be empty' })
  @MaxLength(100)
  orderNumber: string;

  @ApiProperty({
    enum: ['PICKED_UP', 'IN_TRANSIT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RTO_INITIATED'],
    example: 'DELIVERED',
  })
  @IsIn(['PICKED_UP', 'IN_TRANSIT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RTO_INITIATED'], {
    message: 'event must be a valid tracking status event',
  })
  event: 'PICKED_UP' | 'IN_TRANSIT_HUB' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELIVERY_FAILED' | 'RTO_INITIATED';

  @ApiProperty({ example: 'Kathmandu Sorting Facility' })
  @IsStrictText({ minLength: 2, maxLength: 150 })
  eventLocation: string;

  @ApiProperty({ example: '2026-10-04T12:00:00Z' })
  @IsString({ message: 'timestamp must be a string' })
  @IsNotEmpty()
  @MaxLength(50)
  timestamp: string;

  @ApiProperty({ example: 'hmac_sha256_signature_hex...' })
  @IsString({ message: 'signature must be a string' })
  @IsNotEmpty()
  @MaxLength(512)
  signature: string;

  @ApiPropertyOptional({ example: 'https://cdn.carrier.com/pod/sig.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  deliveryProofUrl?: string;

  @ApiPropertyOptional({ example: 'Delivered to recipient at front gate' })
  @IsOptional()
  @IsStrictText({ maxLength: 500 })
  notes?: string;
}
